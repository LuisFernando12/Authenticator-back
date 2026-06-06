import { OauthRequest } from '../../domain/entity/oauth-request.entity';
export const REDIS_SERVICE_PORT = Symbol('REDIS_SERVICE_PORT');
export abstract class RedisServicePort {
  abstract saveAuthRequest(authRequest: OauthRequest): Promise<string>;
  abstract consumeOuthRequest(oauthRequestId: string): Promise<OauthRequest>;
  abstract consumeOauthCode(key: string): Promise<any>;
  abstract saveOauthAuthorizationCode(
    key: string,
    payloadOauthCodeRedis: OauthRequest,
  ): Promise<string>;
  abstract addJtiTokenOnBlockList(jti: string): Promise<string>;
  abstract consultHasJtiTokenOnBlockList(key: string): Promise<boolean>;
}
