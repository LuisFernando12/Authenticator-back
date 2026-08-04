export const REDIS_SERVICE_PORT = Symbol('REDIS_SERVICE_PORT');

export abstract class RedisServicePort {
  abstract saveResetPasswordCodeOTP(code: number, email: string): Promise<void>;
  abstract consumeResetPasswordCodeOTP(
    code: number,
  ): Promise<{ email: string }>;
  abstract clearResetPasswordCodeOTP(code: number): Promise<void>;
  abstract setFailedLoginAttempt(email: string): Promise<void>;
  abstract getFailedLoginAttempt(email: string): Promise<number>;
}
