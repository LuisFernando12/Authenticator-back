import { BaseUseCase } from '@/core/application/use-case/base.use-case';

import { RedisServicePort } from '../port/redis-service-port';
import {
  ITokenIntrospectResponse,
  TokenServicePort,
} from '../port/token-service.port';

export class TokenIntrospectUseCase implements BaseUseCase<
  string,
  ITokenIntrospectResponse | { active: boolean }
> {
  constructor(
    private readonly tokenServicePort: TokenServicePort,
    private readonly redisServicePort: RedisServicePort,
  ) {}
  async execute(
    token: string,
  ): Promise<ITokenIntrospectResponse | { active: boolean }> {
    const tokenIntrospect = await this.tokenServicePort.tokenIntrospect(token);
    if (!tokenIntrospect.active) {
      return tokenIntrospect;
    }
    const { jti } = tokenIntrospect as ITokenIntrospectResponse;
    const hasJtiOnBlockList =
      await this.redisServicePort.consultHasJtiTokenOnBlockList(jti);
    return !hasJtiOnBlockList ? tokenIntrospect : { active: false };
  }
}
