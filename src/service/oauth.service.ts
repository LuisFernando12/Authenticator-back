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
import { UserClientConsentService } from './user-client-consent.service';
import { UserService } from './user.service';

export interface IOauthService {
  authorize(payloadOauth: OauthAuthorizeDTO): Promise<URL>;
  token(payloadOauthToken: OauthTokenDTO): Promise<{
    token_type: string;
    access_token: string;
    scope: string;
    expiresAt: string;
  }>;
  login(payloadOauthLogin: any, QueryOauthLogin: any): Promise<any>;
}
@Injectable()
export class OauthService implements IOauthService {
  constructor(
    private readonly clientService: ClientService,
    private readonly redisService: RedisService,
    private readonly configEnvService: AppConfigEnvService,
    private readonly userClientConsentService: UserClientConsentService,
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

    return urlRedirect;
  }
  async token(payloadOauthToken: OauthTokenDTO): Promise<{
    token_type: string;
    access_token: string;
    scope: string;
    expiresAt: string;
  }> {
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
      const codeRedis = JSON.parse(
        await this.redisService.getdel(`oauth-code-${code.slice(0, 4)}`),
      );
      if (codeVerifier) {
        if (!codeRedis.codeChallenge) {
          throw OauthError.invalidGrant('Invalid code challenge');
        }
        if (
          codeRedis.codeChallengeMethod &&
          codeRedis.codeChallengeMethod !== 'sha256'
        ) {
          throw OauthError.invalidGrant('Invalid code challenge method');
        }
        const codeChallegeVerify = crypto
          .createHash('sha256')
          .update(codeVerifier)
          .digest('base64url');
        if (codeRedis.codeChallenge !== codeChallegeVerify) {
          throw OauthError.invalidGrant('Invalid code verifier');
        }
      }
      if (!codeRedis || codeRedis.code !== code) {
        throw OauthError.invalidGrant(
          'Authorization code is invalid or expired',
        );
      }
      if (codeRedis.clientId !== clientId) {
        throw OauthError.invalidClient('Invalid client ID');
      }
      if (codeRedis.redirectUri !== redirectUri) {
        throw OauthError.invalidRequest('Invalid redirect URI');
      }
      const userDB = await this.userService.findByEmail(codeRedis.userEmail);
      if (!userDB) {
        throw OauthError.unauthorizedClient('Invalid credentials');
      }

      const accessToken = await this.tokenService.generateToken({
        sub: userDB.id,
        username: userDB.email,
        scope: codeRedis.scope,
        aud: clientDB.clientId,
        iss: this.configEnvService.serviceURL,
      });
      if (!accessToken || typeof accessToken !== 'object') {
        throw new InternalServerErrorException('Failure to generate token');
      }

      return {
        token_type: 'Bearer',
        access_token: accessToken.access_token,
        scope: codeRedis.scope,
        expiresAt: accessToken.expiresAt,
      };
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
    const {
      clientId,
      redirectUri,
      state,
      scope,
      codeChallenge,
      codeChallengeMethod,
    } = QueryOauthLogin;
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

    const isMatchedPassword = await bcrypt.compare(password, userDB.password);

    if (!isMatchedPassword) {
      throw OauthError.unauthorizedClient('Invalid credentials');
    }

    if (!userDB.isVerified) {
      throw OauthError.invalidRequest(
        'Please verify your email and active your account',
      );
    }

    const code = crypto
      .createHash('sha256')
      .update(randomBytes(32))
      .digest('base64url');
    const payloadAuthCodeRedis = {
      code,
      userEmail: userDB.email,
      scope,
      clientId,
      redirectUri,
    };
    if (codeChallengeMethod && codeChallenge) {
      if (codeChallengeMethod.toLowerCase() !== 'sha256') {
        throw OauthError.invalidRequest('Code challenge method not supported');
      }
      payloadAuthCodeRedis['codeChallenge'] = codeChallenge;
      payloadAuthCodeRedis['codeChallengeMethod'] = codeChallengeMethod;
    }
    const saveCodeRedis = await this.redisService.set(
      `oauth-code-${code.slice(0, 4)}`,
      JSON.stringify(payloadAuthCodeRedis),
      'EX',
      300,
    );
    if (!saveCodeRedis) {
      throw new InternalServerErrorException('Failure to save code on redis');
    }
    const userClientConsent = await this.userClientConsentService.create({
      userId: userDB.id,
      clientId,
      scopes: scope.split(' '),
    });
    if (!userClientConsent) {
      throw OauthError.unauthorizedClient('Failure to user consent to client');
    }
    const urlRedirect = new URL(redirectUri);
    urlRedirect.searchParams.append('code', code);
    urlRedirect.searchParams.append('state', state);
    return urlRedirect;
  }
}
