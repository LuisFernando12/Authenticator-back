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
      throw OauthError.invalidRequest(
        'Code challenge and code challenge method are required together',
      );
    }
    if (codeChallenge && codeChallengeMethod.toLowerCase() !== 'sha256') {
      throw OauthError.invalidRequest('Code challenge method not supported');
    }
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw OauthError.invalidClient('ClientID authentication failed');
    }
    if (!clientDB.redirectUris.includes(redirectUri)) {
      throw OauthError.invalidRequest('Redirect URI not found');
    }
    if (!clientDB.isConfidential && !codeChallenge) {
      throw OauthError.invalidGrant('Code challenge is required');
    }

    const urlRedirect = new URL(this.configEnvService.oauthLoginURL);
    for (const param in payloadOauth) {
      urlRedirect.searchParams.append(param, payloadOauth[param]);
    }

    if (codeChallengeMethod && codeChallenge) {
      const shortLastFourCharactersClientID = clientId.slice(
        clientId.length - 4,
      );

      this.redisService.set(
        `code-challenge-${shortLastFourCharactersClientID}`,
        codeChallenge,
        'EX',
        600,
      );
      this.redisService.set(
        `code-challenge-method-${shortLastFourCharactersClientID}`,
        codeChallengeMethod,
        'EX',
        600,
      );
    }

    return urlRedirect;
  }
  async token(payloadOauthToken: OauthTokenDTO): Promise<string> {
    const {
      clientId,
      codeVerifier,
      code,
      clientSecret,
      redirectUri,
      grantType,
    } = payloadOauthToken;
    if (!clientSecret && !codeVerifier) {
      throw OauthError.invalidRequest(
        'Client secret or code verifier is required',
      );
    }
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw OauthError.invalidClient('ClientID not found');
    }
    if (clientDB.isConfidential && !clientSecret) {
      throw OauthError.invalidGrant('Client secret is required');
    }
    if (!clientDB.isConfidential && !codeVerifier) {
      throw OauthError.invalidGrant('Code verifier is required');
    }
    if (clientSecret && clientSecret !== clientDB.clientSecret) {
      throw OauthError.invalidClient('Invalid client secret');
    }

    if (!clientDB.redirectUris.includes(redirectUri)) {
      throw OauthError.invalidRequest('Invalid redirect URI');
    }

    if (grantType === 'authorization_code') {
      if (codeVerifier) {
        const shortLastFourCharactersClientID = clientId.slice(
          clientId.length - 4,
        );
        const codeChallengeRedis = await this.redisService.get(
          `code-challenge-${shortLastFourCharactersClientID}`,
        );
        if (!codeChallengeRedis) {
          throw OauthError.invalidGrant('Invalid code challenge');
        }
        const codeChallegeVerify = crypto
          .createHash('sha256')
          .update(codeVerifier)
          .digest('base64url');
        if (codeChallengeRedis !== codeChallegeVerify) {
          throw OauthError.invalidGrant('Invalid code verifier');
        }
        const shortCodeChallenge = codeChallengeRedis.slice(0, 4);
        await this.redisService.del(`code-challenge-${shortCodeChallenge}`);
        await this.redisService.del(
          `code-challenge-method-${shortCodeChallenge}`,
        );
      }

      const codeRedis = JSON.parse(
        await this.redisService.get(`oauth-code-${code.slice(0, 4)}`),
      );
      if (!codeRedis || codeRedis.code !== code) {
        throw OauthError.invalidGrant(
          'Authorization code is invalid or expired',
        );
      }
      if (codeRedis.clientId !== clientId) {
        throw OauthError.invalidClient('Invalid client ID');
      }

      const userDB = await this.userService.findByEmail(codeRedis.userEmail);
      if (!userDB) {
        throw OauthError.unauthorizedClient('Invalid user');
      }

      await this.redisService.del(`oauth-code-${code.slice(0, 4)}`);
      const accessToken = await this.tokenService.generateToken({
        sub: userDB.id,
        username: userDB.email,
        scope: codeRedis.scope,
        aud: clientDB.clientId,
        iss: 'http://localhost:3000',
      });

      return accessToken;
    } else {
      throw OauthError.unsupportedGrantType(
        `Unsupported grant type ${payloadOauthToken.grantType || ''}`,
      );
    }
  }
  async login(
    payloadOauthLogin: LoginDTO,
    QueryOauthLogin: OauthAuthorizeDTO,
  ): Promise<URL> {
    const { clientId, redirectUri, state, scope } = QueryOauthLogin;
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw OauthError.invalidClient('ClientID not found');
    }

    if (!clientDB.redirectUris.includes(redirectUri)) {
      throw OauthError.invalidRequest('Redirect URI not found');
    }

    const { email, password } = payloadOauthLogin;
    const userDB = await this.userService.findByEmail(email);

    if (!userDB) {
      throw OauthError.unauthorizedClient('Invalid credentials');
    }
    if (!userDB.clients.find((client) => client.clientId === clientId)) {
      throw OauthError.invalidClient('Invalid client ID');
    }
    const isMatchedPassword = await bcrypt.compare(password, userDB.password);

    if (!isMatchedPassword) {
      throw OauthError.unauthorizedClient('Invalid credentials');
    }

    if (!userDB.isVerified) {
      throw OauthError.invalidRequest(
        'Please verify your email and active your account',
      );
    }

    const code = randomBytes(64).toString('hex');
    const saveCodeRadis = await this.redisService.set(
      `oauth-code-${code.slice(0, 4)}`,
      JSON.stringify({ code, userEmail: userDB.email, scope, clientId }),
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
