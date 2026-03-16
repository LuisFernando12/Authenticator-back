import { Global, Module } from '@nestjs/common';
import { AuthLogger } from '../config/logger/auth-logger.config';
import { BaseLogger } from '../config/logger/base-logger';
@Global()
@Module({
  providers: [AuthLogger, BaseLogger],
  exports: [AuthLogger, BaseLogger],
})
export class AuthLoggerModule {}
