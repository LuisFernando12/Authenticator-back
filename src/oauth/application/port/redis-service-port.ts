import { OauthRequest } from '../../domain/entity/oauth-request.entity';
export interface IOauthRequestCodePayload {
  userEmail: string;
  codeChallenge: string | null;
  codeChallengeMethod: string | null;
  scope: string;
}
export interface ITokenFamilyRevoked {
  jti: string;
  tokenFamilyId: string;
  refreshToken: string;
  expiresAt: Date;
}
export const REDIS_SERVICE_PORT = Symbol('REDIS_SERVICE_PORT');
export abstract class RedisServicePort {
  abstract saveAuthRequest(authRequest: OauthRequest): Promise<string>;
  abstract consumeOuthRequest(oauthRequestId: string): Promise<OauthRequest>;
  abstract consumeOauthCode(key: string): Promise<any>;
  abstract saveOauthAuthorizationCode(
    key: string,
    payloadOauthCodeRedis: IOauthRequestCodePayload,
  ): Promise<string>;
  abstract addJtiTokenOnBlockList(jti: string): Promise<string>;
  abstract addTokenFamilyToReuseDetection(
    payloadTokenFamily: ITokenFamilyRevoked,
  ): Promise<string>;
  abstract consultHasJtiTokenOnBlockList(key: string): Promise<boolean>;
  abstract consultHasTokenFamilyOnReuseDetection(
    refreshToken: string,
  ): Promise<ITokenFamilyRevoked>;
}
