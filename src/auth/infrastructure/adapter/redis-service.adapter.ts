import { RedisService } from '../../../core/domain/service/redis.service';
import { RedisServicePort } from '../../application/port/redisService.port';
import { AuthDomainError } from '../../domain/error/auth-domain.error';

export class RedisServiceAdapter implements RedisServicePort {
  constructor(private readonly redisService: RedisService) {}
  async saveResetPasswordCodeOTP(code: number, email: string): Promise<void> {
    const saveCodeOTP = await this.redisService.setOnRedis(
      `reset-password-${code}`,
      JSON.stringify({ email: email }),
      600,
    );
    if (!saveCodeOTP) {
      throw AuthDomainError.internalServerError('Failure to save code OTP');
    }
  }
  async consumeResetPasswordCodeOTP(code: number): Promise<{ email: string }> {
    const objectCodeRedis = await this.redisService.getOnRedis(
      `reset-password-${code}`,
    );
    if (!objectCodeRedis) {
      throw AuthDomainError.badRequest('Invalid code !');
    }
    const codeRedis = JSON.parse(objectCodeRedis);
    return codeRedis;
  }
  async clearResetPasswordCodeOTP(code: number): Promise<void> {
    return await this.redisService.deleteFromRedis(`reset-password-${code}`);
  }
}
