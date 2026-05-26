import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'node:crypto';
import { OauthError } from '../../../config/errors/oauth.error';
import { RedisService } from '../../../core/domain/service/redis.service';
import { IClientService } from '../../../service/client.service';
import { IUserClientConsentService } from '../../../service/user-client-consent.service';
import { IUserService } from '../../../service/user.service';
import { IOauthRequestProps } from '../entity/oauth-request.entity';
export interface IValidateRequestPayload {
  oauthRequestId: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
  codeChallenge: string;
  codeChallengeMethod: string;
}
export interface IValidateClientPayload {
  clientId: string;
  redirectUri: string;
}
export interface IValidateUserPayload {
  email: string;
  password: string;
}
export interface IGenerateAndSaveAuthorizationCodePaylod {
  email: string;
  scope: string;
  clientId: string;
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}
export interface IValidateAndCreateRelationUserClientPayload {
  clientId: string;
  userId: string;
  scope: string;
}
export interface IGenerateRedirectURLPayload {
  redirectUri: string;
  code: string;
  state: string;
}

export class LoginService {
  constructor(
    private readonly redisService: RedisService,
    private readonly clientService: IClientService,
    private readonly userClientConsentService: IUserClientConsentService,
    private readonly userService: IUserService,
  ) {}
  async validateRequest(paylod: IValidateRequestPayload) {
    const {
      oauthRequestId,
      clientId,
      redirectUri,
      scope,
      state,
      codeChallenge,
      codeChallengeMethod,
    } = paylod;
    const payloadAuthRequest: IOauthRequestProps = JSON.parse(
      await this.redisService.getAndDeleteOnRedis(
        `oauth:authorize:request:${oauthRequestId}`,
      ),
    );
    if (!payloadAuthRequest) {
      throw OauthError.invalidRequest('Oauth Request ID not found');
    }
    if (payloadAuthRequest.clientId !== clientId) {
      throw OauthError.invalidClient('Invalid client ID');
    }
    if (payloadAuthRequest.redirectUri !== redirectUri) {
      throw OauthError.invalidRequest('Invalid redirect URI');
    }
    if (payloadAuthRequest.state !== state) {
      throw OauthError.invalidRequest('Invalid state');
    }
    if (payloadAuthRequest.scope !== scope) {
      throw OauthError.invalidRequest('Invalid scope');
    }
    if (payloadAuthRequest.codeChallenge && !codeChallenge) {
      throw OauthError.invalidRequest('Code challenge is required');
    }
    if (
      payloadAuthRequest.codeChallenge &&
      payloadAuthRequest.codeChallenge !== codeChallenge
    ) {
      throw OauthError.invalidRequest('Invalid code challenge');
    }
    if (
      payloadAuthRequest.codeChallengeMethod &&
      payloadAuthRequest.codeChallengeMethod !== codeChallengeMethod
    ) {
      throw OauthError.invalidRequest('Invalid code challenge method');
    }
  }
  async validateClient(payload: IValidateClientPayload) {
    const { clientId, redirectUri } = payload;
    const clientDB = await this.clientService.findByClientId(clientId);
    if (!clientDB) {
      throw OauthError.invalidClient('ClientID not found');
    }
    if (!clientDB.redirectUris.includes(redirectUri)) {
      throw OauthError.invalidRequest('Redirect URI not found');
    }
  }
  async validateUser(payload: IValidateUserPayload) {
    const { email, password } = payload;
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
    return {
      userId: userDB.id,
    };
  }
  async generateAndSaveAuthorizationCode(
    payload: IGenerateAndSaveAuthorizationCodePaylod,
  ) {
    const {
      email,
      scope,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
    } = payload;
    const code = crypto
      .createHash('sha256')
      .update(crypto.randomBytes(32))
      .digest('base64url');
    const payloadAuthCodeRedis = {
      code,
      userEmail: email,
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
    const saveCodeRedis = await this.redisService.setOnRedis(
      `oauth-code-${code}`,
      JSON.stringify(payloadAuthCodeRedis),
      300,
    );
    if (!saveCodeRedis) {
      throw new InternalServerErrorException('Failure to save code on redis');
    }
    return {
      code,
    };
  }
  async validateAndCreateRelationUserClient(
    payload: IValidateAndCreateRelationUserClientPayload,
  ) {
    const { clientId, userId, scope } = payload;
    const userClientConsentsDB =
      await this.userClientConsentService.findByUserIdAndClientId(
        userId,
        clientId,
      );
    if (!userClientConsentsDB) {
      const userClientConsent = await this.userClientConsentService.create({
        userId: userId,
        clientId,
        scopes: scope.split(' '),
      });
      if (!userClientConsent) {
        throw OauthError.unauthorizedClient(
          'Failure to user consent to client',
        );
      }
    }
  }
  generateRedirectURL(payload: IGenerateRedirectURLPayload) {
    const { redirectUri, code, state } = payload;
    const urlRedirect = new URL(redirectUri);
    urlRedirect.searchParams.append('code', code);
    urlRedirect.searchParams.append('state', state);
    return urlRedirect;
  }
}
