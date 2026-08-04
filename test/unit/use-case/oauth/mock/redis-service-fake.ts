import {
  IOauthRequestCodePayload,
  ITokenFamilyRevoked,
  RedisServicePort,
} from '@/oauth/application/port/redis-service-port';
import { OauthRequest } from '../../../../../src/oauth/domain/entity/oauth-request.entity';

export class RedisServiceFake implements RedisServicePort {
  async saveAuthRequest(_authRequest: OauthRequest): Promise<string> {
    return 'OK';
  }
  async consumeOauthRequest(oauthRequestId: string): Promise<OauthRequest> {
    return OauthRequest.create({
      oauthRequestId,
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      codeChallenge: 'test-code-challenge',
      codeChallengeMethod: 'sha256',
      state: 'test-state',
      scope: 'read write',
    });
  }
  async consumeOauthCode(_key: string): Promise<any> {
    return {
      code: 'test-oauth-authorization-code',
      codeChallenge: 'test-code-challenge',
      codeChallengeMethod: 'sha256',
      scope: 'read write',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      userEmail: 'john.doe@example.com',
    };
  }
  async saveOauthAuthorizationCode(
    _key: string,
    _payloadOauthCodeRedis: IOauthRequestCodePayload,
  ): Promise<string> {
    return 'OK';
  }
  async addJtiTokenOnBlockList(jti: string): Promise<string> {
    return jti;
  }
  async addTokenFamilyToReuseDetection(
    payloadTokenFamily: ITokenFamilyRevoked,
  ): Promise<string> {
    if (
      payloadTokenFamily.tokenFamilyId === 'test-token-family-id' &&
      payloadTokenFamily.refreshToken === 'test-refresh-token'
    ) {
      return 'OK';
    }
  }
  async consultHasJtiTokenOnBlockList(_key: string): Promise<boolean> {
    return false;
  }
  async consultHasTokenFamilyOnReuseDetection(
    refreshToken: string,
  ): Promise<ITokenFamilyRevoked> {
    return {
      jti: 'test-jti',
      refreshToken: refreshToken,
      tokenFamilyId: 'test-token-family-id',
      expiresAt: new Date(Date.now() + 3600 * 1000),
      email: 'john.doe@example.com',
    };
  }
  setFailedLoginAttempt(email: string): Promise<void> {
    if (email === 'john.doe@example.com') {
      return;
    }
  }
  getFailedLoginAttempt(email: string): Promise<number> {
    if (email === 'john.doe@example.com') {
      return;
    }
  }
}
