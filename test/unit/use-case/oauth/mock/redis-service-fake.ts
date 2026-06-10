import {
  IOauthRequestCodePayload,
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
  async consultHasJtiTokenOnBlockList(_key: string): Promise<boolean> {
    return Promise.resolve(false);
  }
}
