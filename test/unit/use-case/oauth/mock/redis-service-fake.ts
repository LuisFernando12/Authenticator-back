import {
  IOauthRequestCodePayload,
  ITokenFamilyRevoked,
  RedisServicePort,
} from '@/oauth/application/port/redis-service-port';
import { OauthRequest } from '../../../../../src/oauth/domain/entity/oauth-request.entity';

export class RedisServiceFake implements RedisServicePort {
  async saveAuthRequest(_authRequest: OauthRequest): Promise<string> {
    return Promise.resolve('OK');
  }
  async consumeOuthRequest(oauthRequestId: string): Promise<OauthRequest> {
    return Promise.resolve(
      OauthRequest.create({
        oauthRequestId,
        clientId: 'test-client-id',
        redirectUri: 'https://example.com/callback',
        codeChallenge: 'test-code-challenge',
        codeChallengeMethod: 'sha256',
        state: 'test-state',
        scope: 'read write',
      }),
    );
  }
  async consumeOauthCode(_key: string): Promise<any> {
    return Promise.resolve({
      code: 'test-oauth-authorization-code',
      codeChallenge: 'test-code-challenge',
      codeChallengeMethod: 'sha256',
      scope: 'read write',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      userEmail: 'john.doe@example.com',
    });
  }
  async saveOauthAuthorizationCode(
    _key: string,
    _payloadOauthCodeRedis: IOauthRequestCodePayload,
  ): Promise<string> {
    return Promise.resolve('OK');
  }
  async addJtiTokenOnBlockList(jti: string): Promise<string> {
    return Promise.resolve(jti);
  }
  async addTokenFamilyToReuseDetection(
    payloadTokenFamily: ITokenFamilyRevoked,
  ): Promise<string> {
    if (
      payloadTokenFamily.tokenFamilyId === 'test-token-family-id' &&
      payloadTokenFamily.refreshToken === 'test-refresh-token'
    ) {
      return Promise.resolve('OK');
    }
  }
  async consultHasJtiTokenOnBlockList(_key: string): Promise<boolean> {
    return Promise.resolve(false);
  }
  async consultHasTokenFamilyOnReuseDetection(
    refreshToken: string,
  ): Promise<ITokenFamilyRevoked> {
    return Promise.resolve({
      jti: 'test-jti',
      refreshToken: refreshToken,
      tokenFamilyId: 'test-token-family-id',
      expiresAt: new Date(Date.now() + 3600 * 1000),
    });
  }
}
