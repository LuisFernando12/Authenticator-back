import { AuthLogger } from '@/config/logger/auth-logger.config';
import { BaseLogger } from '@/config/logger/base-logger';
import { Global, Module } from '@nestjs/common';
@Global()
@Module({
  providers: [AuthLogger, BaseLogger],
  exports: [AuthLogger, BaseLogger],
})
export class AuthLoggerModule {}
