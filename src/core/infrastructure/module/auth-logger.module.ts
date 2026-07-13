import { AuthenticatorLogger } from '@/config/logger/auth-logger.config';
import { BaseLogger } from '@/config/logger/base-logger';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  providers: [AuthenticatorLogger, BaseLogger],
  exports: [AuthenticatorLogger, BaseLogger],
})
export class AuthenticatorLoggerModule {}
