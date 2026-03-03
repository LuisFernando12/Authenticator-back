import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { randomBytes } from 'node:crypto';
import { LoginDTO } from '../dto/login.dto';
import { OauthAuthorizeDTO, OauthTokenDTO } from '../dto/oauth-authorize.dto';
import { AppConfigEnvService } from './app-config-env.service';
import { ClientService } from './client.service';
import { RedisService } from './redis.service';
import { TokenService } from './token.service';
import { UserService } from './user.service';

export interface IOauthService {
  authorize(payloadOauth: OauthAuthorizeDTO): Promise<URL>;
  token(payloadOauthToken: OauthTokenDTO): Promise<string>;
  login(payloadOauthLogin: any, QueryOauthLogin: any): Promise<any>;
}
@Injectable()
export class OauthService implements IOauthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly redisService: RedisService,
    private readonly configEnvService: AppConfigEnvService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
  async authorize(payloadOauth: OauthAuthorizeDTO): Promise<URL> {
    const { clientId, redirectUri } = payloadOauth;
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw new UnauthorizedException('ClientID not found');
    }
    if (!clientDB.redirectUris.includes(redirectUri)) {
      throw new UnauthorizedException('Redirect URI not found');
    }
    const urlRedirect = new URL(this.configEnvService.oauthLoginURL);
    for (const param in payloadOauth) {
      urlRedirect.searchParams.append(param, payloadOauth[param]);
    }
    if (
      (payloadOauth.codeChallenge && !payloadOauth.codeChallengeMethod) ||
      (!payloadOauth.codeChallenge && payloadOauth.codeChallengeMethod)
    ) {
      throw new BadRequestException(
        'Code challenge and code challenge method are required together',
      );
    }
    if (payloadOauth.codeChallengeMethod && payloadOauth.codeChallenge) {
      this.redisService.set(
        `code-challenge-${clientId.slice(0, 4)}`,
        payloadOauth.codeChallenge,
        'EX',
        600,
      );
      this.redisService.set(
        'code-challenge-method',
        payloadOauth.codeChallengeMethod,
        'EX',
        600,
      );
    }

    return urlRedirect;
  }
  async token(payloadOauthToken: OauthTokenDTO): Promise<string> {
    const clientDB = await this.clientService.findByClientId(
      payloadOauthToken.clientId,
    );
    if (!clientDB) {
      throw new UnauthorizedException('ClientID not found');
    }
    if (
      payloadOauthToken.clientSecret &&
      clientDB.clientSecret !== payloadOauthToken.clientSecret
    ) {
      throw new UnauthorizedException('Invalid client secret');
    }
    if (!clientDB.redirectUris.includes(payloadOauthToken.redirectUri)) {
      throw new UnauthorizedException('Invalid redirect URI');
    }
    if (payloadOauthToken.grantType === 'authorization_code') {
      if (payloadOauthToken.codeVerifier) {
        const codeChallengeRedis = await this.redisService.get(
          `code-challenge-${payloadOauthToken.clientId.slice(0, 4)}`,
        );
        if (!codeChallengeRedis) {
          throw new UnauthorizedException('Invalid code challenge');
        }
        const codeChallegeVerify = crypto
          .createHash('sha256')
          .update(payloadOauthToken.codeVerifier)
          .digest('base64url');
        if (codeChallengeRedis !== codeChallegeVerify) {
          throw new UnauthorizedException('Invalid code verifier');
        }
        await this.redisService.del('code-challenge');
        await this.redisService.del('code-challenge-method');
      }
      const codeRedis = JSON.parse(
        await this.redisService.get(
          `oauth-code-${payloadOauthToken.code.slice(0, 4)}`,
        ),
      );
      if (!codeRedis || codeRedis.code !== payloadOauthToken.code) {
        throw new UnauthorizedException('Invalid code');
      }
      const userDB = await this.userService.findByEmail(codeRedis.userEmail);
      if (!userDB) {
        throw new UnauthorizedException('Invalid user');
      }
      await this.redisService.del(
        `oauth-code-${payloadOauthToken.code.slice(0, 4)}`,
      );
      const accessToken = await this.tokenService.generateToken({
        sub: userDB.id,
        username: userDB.email,
      });
      return accessToken;
    } else {
      throw new UnauthorizedException('Invalid grant type');
    }
  }
  async login(
    payloadOauthLogin: LoginDTO,
    QueryOauthLogin: OauthAuthorizeDTO,
  ): Promise<any> {
    const { clientId, redirectUri, state } = QueryOauthLogin;
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw new UnauthorizedException('ClientID not found');
    }
    if (clientDB.redirectUris.indexOf(redirectUri) === -1) {
      throw new UnauthorizedException('Redirect URI not found');
    }
    const { email, password } = payloadOauthLogin;
    const userDB = await this.userService.findByEmail(email);
    if (!userDB) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatchedPassword = await bcrypt.compare(password, userDB.password);
    if (!isMatchedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!userDB.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email and active your account',
      );
    }
    const code = randomBytes(64).toString('hex');
    const saveCodeRadis = await this.redisService.set(
      `oauth-code-${code.slice(0, 4)}`,
      JSON.stringify({ code, userEmail: userDB.email }),
      'EX',
      900,
    );
    if (!saveCodeRadis) {
      throw new InternalServerErrorException('Failure to save code on redis');
    }
    const urlRedirect = new URL(redirectUri);
    urlRedirect.searchParams.append('code', code);
    urlRedirect.searchParams.append('state', state);
    return urlRedirect;
  }
}
