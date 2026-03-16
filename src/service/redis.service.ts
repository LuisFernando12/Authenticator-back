import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { AuthLogger } from '../config/logger/auth-logger.config';
import { AppConfigEnvService } from './app-config-env.service';
@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    private readonly appConfigEnvService: AppConfigEnvService,
    @Inject(AuthLogger) private readonly authLogger: AuthLogger,
  ) {
    super(appConfigEnvService.redisURI);
  }
  async onModuleInit() {
    await this.ping();
    this.authLogger.log('Redis Connect !', {
      context: 'Redis Service',
    });
  }
  async onModuleDestroy() {
    await this.quit();
    this.authLogger.log('Redis Disconnect !', {
      context: 'Redis Service',
    });
  }
}
