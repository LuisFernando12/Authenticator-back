import { RedisService } from '../../../core/domain/service/redis.service';
import {
  IOauthRequestCodePayload,
  RedisServicePort,
} from '../../application/port/redis-service-port';
import { OauthRequest } from '../../domain/entity/oauth-request.entity';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class RedisServiceAdapter implements RedisServicePort {
  constructor(private readonly redisService: RedisService) {}
  async saveAuthRequest(authRequest: OauthRequest): Promise<string> {
    const saveAuthRequestOnRedis = await this.redisService.setOnRedis(
      `oauth:authorize:request:${authRequest.oauthRequestId}`,
      authRequest.stringfy(),
      300,
    );
    if (!saveAuthRequestOnRedis) {
      throw OauthDomainError.invalidGrant(
        'Failure to save authRequest on redis!',
      );
    }
    return saveAuthRequestOnRedis;
  }
  async consumeOuthRequest(oauthRequestId: string): Promise<OauthRequest> {
    const payloadAuthRequest = await this.redisService.getAndDeleteOnRedis(
      `oauth:authorize:request:${oauthRequestId}`,
    );
    if (!payloadAuthRequest) {
      throw OauthDomainError.invalidGrant('Oauth Request ID not found');
    }
    return OauthRequest.parseJSON(payloadAuthRequest);
  }
  async consumeOauthCode(key: string): Promise<any> {
    const codeRedis = JSON.parse(
      await this.redisService.getAndDeleteOnRedis(`oauth-code-${key}`),
    );
    if (!codeRedis) {
      throw OauthDomainError.invalidClient('Authorization code expired');
    }
    return codeRedis;
  }
  async saveOauthAuthorizationCode(
    code: string,
    payloadOauthCodeRedis: IOauthRequestCodePayload,
  ): Promise<string> {
    const saveCodeRedis = await this.redisService.setOnRedis(
      `oauth-code-${code}`,
      JSON.stringify(payloadOauthCodeRedis),
      300,
    );
    if (!saveCodeRedis) {
      throw OauthDomainError.internalServerError(
        'Failure to save code on redis',
      );
    }
    return saveCodeRedis;
  }
  async addJtiTokenOnBlockList(jti: string): Promise<string> {
    const revokeTokenBlocklist = await this.redisService.setOnRedis(
      `revoke-token-blocklist:${jti}`,
      jti,
      900,
    );
    if (revokeTokenBlocklist !== 'OK') {
      throw new Error('Failure to save token like blocked on redis !');
    }
    return revokeTokenBlocklist;
  }
  async consultHasJtiTokenOnBlockList(jti: string): Promise<boolean> {
    const tokenIsBolecked = await this.redisService.getOnRedis(
      `revoke-token-blocklist:${jti}`,
    );
    return !!tokenIsBolecked;
  }
}
