import { RedisServicePort } from '@/auth/application/port/redis-service.port';

export class RedisServiceFake implements RedisServicePort {
  async saveResetPasswordCodeOTP(
    _code: number,
    _email: string,
  ): Promise<void> {
    return;
  }

  async consumeResetPasswordCodeOTP(
    _code: number,
  ): Promise<{ email: string }> {
    return { email: 'john.doe@example.com' };
  }

  async clearResetPasswordCodeOTP(_code: number): Promise<void> {
    return;
  }
}
