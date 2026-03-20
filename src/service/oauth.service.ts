import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { randomBytes } from 'node:crypto';
import { OauthError } from '../config/errors/oauth.error';
import { AuthLogger } from '../config/logger/auth-logger.config';
import { LoginDTO } from '../dto/login.dto';
import {
  OauthAuthorizeDTO,
  OauthRefreshTokenDTO,
  OauthTokenDTO,
} from '../dto/oauth-authorize.dto';
import { AppConfigEnvService } from './app-config-env.service';
import { ClientService } from './client.service';
import { RedisService } from './redis.service';
import { IResponseTokenIntrospect, TokenService } from './token.service';
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
  refreshToken(payloadOauthRefreshToken: OauthRefreshTokenDTO): Promise<any>;
  revokeToken(token: string): Promise<any>;
  tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }>;
}
export interface IPayloadAuthRequest {
  clientId: string;
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  state: string;
  scope: string;
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
    private readonly authLogger: AuthLogger,
  ) {}
  async authorize(
    payloadOauth: Omit<OauthAuthorizeDTO, 'oauthRequestId'>,
  ): Promise<URL> {
    const {
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state,
      scope,
    } = payloadOauth;
    this.authLogger.log('Starting method authorize', {
      context: 'OauthService method authorize',
    });
    if (
      (codeChallenge && !codeChallengeMethod) ||
      (!codeChallenge && codeChallengeMethod)
    ) {
      this.authLogger.error(
        `Code challenge and code challenge method are required together: missing ${codeChallenge ? 'codeChallengeMethod' : 'codeChallenge'}`,
        {
          context: 'OauthService method authorize',
        },
      );
      throw OauthError.invalidRequest(
        'Code challenge and code challenge method are required together',
      );
    }
    if (codeChallenge && codeChallengeMethod.toLowerCase() !== 'sha256') {
      this.authLogger.error(
        `Code challenge method not supported: ${codeChallengeMethod}`,
        {
          context: 'OauthService method authorize',
        },
      );
      throw OauthError.invalidRequest('Code challenge method not supported');
    }
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      this.authLogger.error(
        `ClientID authentication failed client not found: ${clientId}`,
        {
          context: 'OauthService method authorize',
        },
      );
      throw OauthError.invalidClient('ClientID authentication failed');
    }
    if (!clientDB.redirectUris.includes(redirectUri)) {
      this.authLogger.error(`Redirect URI not found: ${redirectUri}`, {
        context: 'OauthService method authorize',
      });
      throw OauthError.invalidRequest('Redirect URI not found');
    }
    if (!clientDB.isConfidential && !codeChallenge) {
      this.authLogger.error(`Code challenge is required: ${codeChallenge}`, {
        context: 'OauthService method authorize',
      });
      throw OauthError.invalidGrant('Code challenge is required');
    }
    const payloadAuthResquest: IPayloadAuthRequest = {
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state,
      scope,
    };

    const oauthRequestID = crypto
      .createHash('sha256')
      .update(randomBytes(16).toString('hex'))
      .digest('base64url');

    const saveAuthRequestOnRedis = await this.redisService.set(
      `oauth:authorize:request:${oauthRequestID}`,
      JSON.stringify(payloadAuthResquest),
      'EX',
      300,
    );

    if (!saveAuthRequestOnRedis) {
      this.authLogger.error(
        `Failure to save authRequest on redis: ${saveAuthRequestOnRedis}`,
        {
          context: 'OauthService method authorize',
        },
      );
      throw new InternalServerErrorException(
        'Failure to save authRequest on redis',
      );
    }
    const urlRedirect = new URL(this.configEnvService.oauthLoginURL);
    urlRedirect.searchParams.append('oauthRequestId', oauthRequestID);
    for (const param in payloadOauth) {
      urlRedirect.searchParams.append(param, payloadOauth[param]);
    }
    this.authLogger.log('Successful authorization request', {
      context: 'OauthService method authorize',
    });
    return urlRedirect;
  }
  async token(payloadOauthToken: OauthTokenDTO): Promise<{
    token_type: string;
    access_token: string;
    refresh_token: string;
    scope: string;
    expiresAt: string;
  }> {
    this.authLogger.log('Starting method token', {
      context: 'OauthService method token',
    });
    const {
      clientId,
      codeVerifier,
      code,
      clientSecret,
      redirectUri,
      grantType,
    } = payloadOauthToken;
    if (!clientSecret && !codeVerifier) {
      this.authLogger.error(
        'Client secret or code verifier is required and none of them is provided',
        {
          context: 'OauthService method token',
        },
      );
      throw OauthError.invalidRequest(
        'Client secret or code verifier is required',
      );
    }
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      this.authLogger.error(`ClientID not found: ${clientId}`, {
        context: 'OauthService method token',
      });
      throw OauthError.invalidClient('ClientID not found');
    }
    if (clientDB.isConfidential && !clientSecret) {
      this.authLogger.error(
        `Client secret is required and this is not provided: ${clientSecret}`,
        {
          context: 'OauthService method token',
        },
      );
      throw OauthError.invalidGrant('Client secret is required');
    }
    if (!clientDB.isConfidential && !codeVerifier) {
      this.authLogger.error(
        `Code verifier is required and this is not  provided: ${codeVerifier}`,
        {
          context: 'OauthService method token',
        },
      );
      throw OauthError.invalidGrant('Code verifier is required');
    }
    if (clientSecret && clientSecret !== clientDB.clientSecret) {
      this.authLogger.error(`Client secret is invalid: ${clientSecret}`, {
        context: 'OauthService method token',
      });
      throw OauthError.invalidClient('Invalid client secret');
    }

    if (!clientDB.redirectUris.includes(redirectUri)) {
      this.authLogger.error(`Invalid redirect URI: ${redirectUri}`, {
        context: 'OauthService method token',
      });
      throw OauthError.invalidRequest('Invalid redirect URI');
    }

    if (grantType === 'authorization_code') {
      const codeRedis = JSON.parse(
        await this.redisService.getdel(`oauth-code-${code}`),
      );
      if (codeVerifier) {
        if (!codeRedis.codeChallenge) {
          this.authLogger.error(
            `Invalid code challenge: ${codeRedis.codeChallenge}`,
            {
              context: 'OauthService method token',
            },
          );
          throw OauthError.invalidGrant('Invalid code challenge');
        }
        if (
          codeRedis.codeChallengeMethod &&
          codeRedis.codeChallengeMethod !== 'sha256'
        ) {
          this.authLogger.error(
            `Invalid code challenge method: ${codeRedis.codeChallengeMethod}`,
            {
              context: 'OauthService method token',
            },
          );
          throw OauthError.invalidGrant('Invalid code challenge method');
        }
        const codeChallegeVerify = crypto
          .createHash('sha256')
          .update(codeVerifier)
          .digest('base64url');
        if (codeRedis.codeChallenge !== codeChallegeVerify) {
          this.authLogger.error(
            `Invalid code verifier: ${codeChallegeVerify}`,
            {
              context: 'OauthService method token',
            },
          );
          throw OauthError.invalidGrant('Invalid code verifier');
        }
      }
      if (!codeRedis || codeRedis.code !== code) {
        this.authLogger.error(`Invalid authorization code: ${code}`, {
          context: 'OauthService method token',
        });
        throw OauthError.invalidGrant(
          'Authorization code is invalid or expired',
        );
      }
      if (codeRedis.clientId !== clientId) {
        this.authLogger.error(`Invalid client ID: ${clientId}`, {
          context: 'OauthService method token',
        });
        throw OauthError.invalidClient('Invalid client ID');
      }
      if (codeRedis.redirectUri !== redirectUri) {
        this.authLogger.error(`Invalid redirect URI: ${redirectUri}`, {
          context: 'OauthService method token',
        });
        throw OauthError.invalidRequest('Invalid redirect URI');
      }
      const userDB = await this.userService.findByEmail(codeRedis.userEmail);
      if (!userDB) {
        this.authLogger.error(
          `Invalid credentials user not found with email: ${codeRedis.userEmail}`,
          {
            context: 'OauthService method token',
          },
        );
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
        this.authLogger.error(`Failure to generate token: ${accessToken}`, {
          context: 'OauthService method token',
        });
        throw new InternalServerErrorException('Failure to generate token');
      }

      return {
        token_type: 'Bearer',
        access_token: accessToken.access_token,
        refresh_token: accessToken.refresh_token,
        scope: codeRedis.scope,
        expiresAt: accessToken.expiresAt,
      };
    } else {
      this.authLogger.error(
        `Unsupported grant type: ${payloadOauthToken.grantType || ''}`,
        {
          context: 'OauthService method token',
        },
      );
      throw OauthError.unsupportedGrantType(
        `Unsupported grant type ${payloadOauthToken.grantType || ''}`,
      );
    }
  }
  async login(
    payloadOauthLogin: LoginDTO,
    QueryOauthLogin: OauthAuthorizeDTO,
  ): Promise<URL> {
    this.authLogger.log('Starting method login', {
      context: 'OauthService method login',
    });
    const {
      clientId,
      redirectUri,
      state,
      scope,
      codeChallenge,
      codeChallengeMethod,
      oauthRequestId,
    } = QueryOauthLogin;

    if (
      (codeChallenge && !codeChallengeMethod) ||
      (!codeChallenge && codeChallengeMethod)
    ) {
      this.authLogger.error(
        'Code challenge and code challenge method are required together and none of them is provided',
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest(
        'Code challenge and code challenge method are required together',
      );
    }

    const payloadAuthRequest: IPayloadAuthRequest = JSON.parse(
      await this.redisService.getdel(
        `oauth:authorize:request:${oauthRequestId}`,
      ),
    );
    if (!payloadAuthRequest) {
      this.authLogger.error(`Oauth Request ID not found: ${oauthRequestId}`, {
        context: 'OauthService method login',
      });
      throw OauthError.invalidRequest('Oauth Request ID not found');
    }
    if (payloadAuthRequest.clientId !== clientId) {
      this.authLogger.error(
        `Invalid client ID ${clientId} mismetch with authRequest client ID ${payloadAuthRequest.clientId}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidClient('Invalid client ID');
    }
    if (payloadAuthRequest.redirectUri !== redirectUri) {
      this.authLogger.error(
        `Invalid redirect URI ${redirectUri} mismetch with authRequest redirect URI ${payloadAuthRequest.redirectUri}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest('Invalid redirect URI');
    }
    if (payloadAuthRequest.state !== state) {
      this.authLogger.error(
        `Invalid state ${state} mismetch with authRequest state ${payloadAuthRequest.state}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest('Invalid state');
    }
    if (payloadAuthRequest.scope !== scope) {
      this.authLogger.error(
        `Invalid scope ${scope} mismetch with authRequest scope ${payloadAuthRequest.scope}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest('Invalid scope');
    }
    if (payloadAuthRequest.codeChallenge && !codeChallenge) {
      this.authLogger.error(
        `Code challenge is required and this is not provided: ${codeChallenge}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest('Code challenge is required');
    }
    if (
      payloadAuthRequest.codeChallenge &&
      payloadAuthRequest.codeChallenge !== codeChallenge
    ) {
      this.authLogger.error(
        `Invalid code challenge ${codeChallenge} mismetch with authRequest code challenge ${payloadAuthRequest.codeChallenge}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest('Invalid code challenge');
    }
    if (
      payloadAuthRequest.codeChallengeMethod &&
      payloadAuthRequest.codeChallengeMethod !== codeChallengeMethod
    ) {
      this.authLogger.error(
        `Invalid code challenge method ${codeChallengeMethod} mismetch with authRequest code challenge method ${payloadAuthRequest.codeChallengeMethod}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.invalidRequest('Invalid code challenge method');
    }

    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      this.authLogger.error(`ClientID not found with ID: ${clientId}`, {
        context: 'OauthService method login',
      });
      throw OauthError.invalidClient('ClientID not found');
    }

    if (!clientDB.redirectUris.includes(redirectUri)) {
      this.authLogger.error(`Redirect URI not found with URI: ${redirectUri}`, {
        context: 'OauthService method login',
      });
      throw OauthError.invalidRequest('Redirect URI not found');
    }

    const { email, password } = payloadOauthLogin;
    const userDB = await this.userService.findByEmail(email);

    if (!userDB) {
      this.authLogger.error(
        `Invalid credentials user not found with email: ${email}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.unauthorizedClient('Invalid credentials');
    }

    const isMatchedPassword = await bcrypt.compare(password, userDB.password);

    if (!isMatchedPassword) {
      this.authLogger.error(`Invalid credentials password mismatch`, {
        context: 'OauthService method login',
      });
      throw OauthError.unauthorizedClient('Invalid credentials');
    }

    if (!userDB.isVerified) {
      this.authLogger.error(`User ${email} not verified`, {
        context: 'OauthService method login',
      });
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
        this.authLogger.error(
          `Code challenge method not supported ! method: ${codeChallengeMethod}`,
          {
            context: 'OauthService method login',
          },
        );
        throw OauthError.invalidRequest('Code challenge method not supported');
      }

      payloadAuthCodeRedis['codeChallenge'] = codeChallenge;
      payloadAuthCodeRedis['codeChallengeMethod'] = codeChallengeMethod;
    }
    const saveCodeRedis = await this.redisService.set(
      `oauth-code-${code}`,
      JSON.stringify(payloadAuthCodeRedis),
      'EX',
      300,
    );
    if (!saveCodeRedis) {
      this.authLogger.error(`Failure to save code on redis: ${saveCodeRedis}`, {
        context: 'OauthService method login',
      });
      throw new InternalServerErrorException('Failure to save code on redis');
    }
    const userClientConsent = await this.userClientConsentService.create({
      userId: userDB.id,
      clientId,
      scopes: scope.split(' '),
    });
    if (!userClientConsent) {
      this.authLogger.error(
        `Failure to create user client consent: ${userClientConsent}`,
        {
          context: 'OauthService method login',
        },
      );
      throw OauthError.unauthorizedClient('Failure to user consent to client');
    }
    this.authLogger.log('Successful login request', {
      context: 'OauthService method login',
    });
    const urlRedirect = new URL(redirectUri);
    urlRedirect.searchParams.append('code', code);
    urlRedirect.searchParams.append('state', state);
    return urlRedirect;
  }
  async refreshToken(
    payloadOauthRefreshToken: OauthRefreshTokenDTO,
  ): Promise<any> {
    this.authLogger.log('Starting method refreshToken', {
      context: 'OauthService method refreshToken',
    });
    const { refreshToken, grantType } = payloadOauthRefreshToken;
    if (grantType !== 'refresh_token') {
      this.authLogger.error(
        `Unsupported grant type: ${payloadOauthRefreshToken.grantType || ''}`,
        {
          context: 'OauthService method refreshToken',
        },
      );
      throw OauthError.invalidGrant(
        `Invalid grant type: ${payloadOauthRefreshToken.grantType || ''}`,
      );
    }
    const token = await this.tokenService.verifyToken(refreshToken);
    if (!token) {
      this.authLogger.error(`Invalid refresh token: ${refreshToken}`, {
        context: 'OauthService method refreshToken',
      });
      throw OauthError.invalidGrant('Invalid refresh token');
    }
    if (token.exp < Math.floor(Date.now() / 1000)) {
      this.authLogger.error(
        `Refresh token expired,  token exp: ${new Date(token.exp * 1000)}`,
        {
          context: 'OauthService method refreshToken',
        },
      );
      throw OauthError.invalidGrant('Refresh token expired');
    }
    const userDB = await this.userService.findByEmail(token.username);
    if (!userDB) {
      this.authLogger.error(
        `Invalid credentials user not found with email: ${token.username}`,
        {
          context: 'OauthService method refreshToken',
        },
      );
      throw OauthError.unauthorizedClient('Invalid credentials');
    }
    const userClientConsentDB =
      await this.userClientConsentService.findByUserIdAndClientId(
        userDB.id,
        token.aud,
      );
    if (!userClientConsentDB) {
      this.authLogger.error(`Invalid client ID: ${token.aud}`, {
        context: 'OauthService method refreshToken',
      });
      throw OauthError.invalidClient('Invalid client ID');
    }
    const newAccessToken = await this.tokenService.refreshToken(
      {
        sub: userDB.id,
        username: userDB.email,
        scope: token.scope,
        aud: token.aud,
        iss: this.configEnvService.serviceURL,
      },
      refreshToken,
    );
    if (!newAccessToken || typeof newAccessToken !== 'object') {
      this.authLogger.error(`Failure to generate token: ${newAccessToken}`, {
        context: 'OauthService method refreshToken',
      });
      throw new InternalServerErrorException('Failure to generate token');
    }
    return newAccessToken;
  }
  async revokeToken(token: string): Promise<any> {
    this.authLogger.log('Starting method revokeToken', {
      context: 'OauthService method revokeToken',
    });
    const tokenIsValid = await this.tokenService.verifyToken(token);
    if (!tokenIsValid) {
      this.authLogger.error(`Invalid token: ${JSON.stringify(token)}`, {
        context: 'OauthService method revokeToken',
      });
      throw OauthError.invalidRequest('Invalid token');
    }
    const tokenExpire = new Date(tokenIsValid.exp * 1000);
    if (tokenExpire < new Date()) {
      this.authLogger.error(`Token expired: ${tokenExpire}`, {
        context: 'OauthService method revokeToken',
      });
      throw OauthError.invalidRequest('Token expired');
    }
    const tokenDeletedOnDB = await this.tokenService.revokeToken(token);
    if (!tokenDeletedOnDB) {
      this.authLogger.error(`Failure to revoke token: ${tokenDeletedOnDB}`, {
        context: 'OauthService method revokeToken',
      });
      throw new InternalServerErrorException('Failure to revoke token');
    }
    const tokenDecoded = await this.tokenService.decodeToken(
      tokenDeletedOnDB.accessToken,
    );
    const tokenDecodedExpires = new Date(tokenDecoded.exp * 1000);
    const timeToExpireToken = Math.floor(
      (tokenDecodedExpires.getTime() - new Date().getTime()) / 1000,
    );
    const revokeTokenBlocklist = await this.redisService.set(
      `revoke-token-blocklist:${tokenDeletedOnDB.accessToken}`,
      tokenDeletedOnDB.accessToken,
      'EX',
      timeToExpireToken || 300,
    );
    if (revokeTokenBlocklist !== 'OK') {
      this.authLogger.error(
        'Failure to save token like blocked on redis with the key: revoke-token-blocklist',
        { context: 'OauthService method revokeToken' },
      );
      throw new InternalServerErrorException(
        'Failure to save token like blocked on redis !',
      );
    }
    return { message: 'Token revoked successfully' };
  }
  async tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }> {
    this.authLogger.log('Starting method tokenIntrospect', {
      context: 'OauthService method tokenIntrospect',
    });
    const tokenIsBolecked = await this.redisService.get(
      `revoke-token-blocklist:${token}`,
    );
    if (tokenIsBolecked) {
      this.authLogger.error(`Token is blocked: ${token}`, {
        context: 'OauthService method tokenIntrospect',
      });
      return { active: false };
    }
    const tokenIntrospect = await this.tokenService.tokenIntrospect(token);

    return tokenIntrospect;
  }
}
