import { BaseUseCase } from '@/core/application/use-case/base.use-case';
import { RedisServicePort } from '../port/redis-service-port';
import { TokenServicePort } from '../port/token-service.port';

export interface IRevokeTokenResponse {
  message: string;
}
export class RevokeTokenUseCase implements BaseUseCase<
  string,
  IRevokeTokenResponse
> {
  constructor(
    private readonly tokenServicePort: TokenServicePort,
    private readonly redisServicePort: RedisServicePort,
  ) {}
  async execute(token: string): Promise<IRevokeTokenResponse> {
    const refreshTokenHashed = this.tokenServicePort.hashRefreshToken(token);
    const tokenDB =
      await this.tokenServicePort.findByRefreshToken(refreshTokenHashed);
    tokenDB.validateRefreshTokenIsValid();
    const { jti } = tokenDB;
    await this.tokenServicePort.revokeToken(refreshTokenHashed);
    await this.redisServicePort.addJtiTokenOnBlockList(jti);
    return { message: 'Token revoked successfully' };
  }
}
