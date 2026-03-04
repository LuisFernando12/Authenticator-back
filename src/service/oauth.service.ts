import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { randomBytes } from 'node:crypto';
import { LoginDTO } from '../dto/login.dto';
import { OauthAuthorizeDTO, OauthTokenDTO } from '../dto/oauth-authorize.dto';
import { OauthError } from '../errors/oauth.error';
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
    const { clientId, redirectUri, codeChallenge, codeChallengeMethod } =
      payloadOauth;
    if (
      (codeChallenge && !codeChallengeMethod) ||
      (!codeChallenge && codeChallengeMethod)
    ) {
      throw new OauthError(
        'Code challenge and code challenge method are required together',
      );
    }
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw new OauthError('ClientID not found');
    }
    if (!clientDB.redirectUris.includes(redirectUri)) {
      throw new OauthError('Redirect URI not found');
    }
    if (!clientDB.isCofidential && !codeChallenge) {
      throw new OauthError('Code challenge is required');
    }

    const urlRedirect = new URL(this.configEnvService.oauthLoginURL);
    for (const param in payloadOauth) {
      urlRedirect.searchParams.append(param, payloadOauth[param]);
    }

    if (codeChallengeMethod && codeChallenge) {
      this.redisService.set(
        `code-challenge-${clientId.slice(0, 4)}`,
        codeChallenge,
        'EX',
        600,
      );
      this.redisService.set(
        'code-challenge-method',
        codeChallengeMethod,
        'EX',
        600,
      );
    }

    return urlRedirect;
  }
  async token(payloadOauthToken: OauthTokenDTO): Promise<string> {
    if (!payloadOauthToken.clientSecret && !payloadOauthToken.codeVerifier) {
      throw new OauthError('Client secret or code verifier is required');
    }
    const clientDB = await this.clientService.findByClientId(
      payloadOauthToken.clientId,
    );
    if (clientDB.isCofidential && !payloadOauthToken.clientSecret) {
      throw new OauthError('Client secret is required');
    }
    if (!clientDB.isCofidential && !payloadOauthToken.codeVerifier) {
      throw new OauthError('Code verifier is required');
    }
    if (!clientDB) {
      throw new OauthError('ClientID not found');
    }

    if (
      payloadOauthToken.clientSecret &&
      clientDB.clientSecret !== payloadOauthToken.clientSecret
    ) {
      throw new OauthError('Invalid client secret');
    }

    if (!clientDB.redirectUris.includes(payloadOauthToken.redirectUri)) {
      throw new OauthError('Invalid redirect URI');
    }

    if (payloadOauthToken.grantType === 'authorization_code') {
      if (payloadOauthToken.codeVerifier) {
        const codeChallengeRedis = await this.redisService.get(
          `code-challenge-${payloadOauthToken.clientId.slice(0, 4)}`,
        );
        if (!codeChallengeRedis) {
          throw new OauthError('Invalid code challenge');
        }
        const codeChallegeVerify = crypto
          .createHash('sha256')
          .update(payloadOauthToken.codeVerifier)
          .digest('base64url');
        if (codeChallengeRedis !== codeChallegeVerify) {
          throw new OauthError('Invalid code verifier');
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
        throw new OauthError('Invalid code');
      }

      const userDB = await this.userService.findByEmail(codeRedis.userEmail);
      if (!userDB) {
        throw new OauthError('Invalid user');
      }

      await this.redisService.del(
        `oauth-code-${payloadOauthToken.code.slice(0, 4)}`,
      );
      console.log(process.env.HOST);
      const accessToken = await this.tokenService.generateToken({
        sub: userDB.id,
        username: userDB.email,
        scope: codeRedis.scope,
        aud: clientDB.clientId,
        iss: 'http://localhost:3000',
      });

      return accessToken;
    } else {
      throw new OauthError('Invalid grant type');
    }
  }
  async login(
    payloadOauthLogin: LoginDTO,
    QueryOauthLogin: OauthAuthorizeDTO,
  ): Promise<any> {
    const { clientId, redirectUri, state, scope } = QueryOauthLogin;
    const clientDB = await this.clientService.findByClientId(clientId);

    if (!clientDB) {
      throw new OauthError('ClientID not found');
    }

    if (clientDB.redirectUris.indexOf(redirectUri) === -1) {
      throw new OauthError('Redirect URI not found');
    }

    const { email, password } = payloadOauthLogin;
    const userDB = await this.userService.findByEmail(email);

    if (!userDB) {
      throw new OauthError('Invalid credentials');
    }

    const isMatchedPassword = await bcrypt.compare(password, userDB.password);

    if (!isMatchedPassword) {
      throw new OauthError('Invalid credentials');
    }

    if (!userDB.isVerified) {
      throw new OauthError('Please verify your email and active your account');
    }

    const code = randomBytes(64).toString('hex');
    const saveCodeRadis = await this.redisService.set(
      `oauth-code-${code.slice(0, 4)}`,
      JSON.stringify({ code, userEmail: userDB.email, scope }),
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
