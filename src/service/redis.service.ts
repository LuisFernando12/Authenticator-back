import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AppConfigEnvService } from './app-config-env.service';
@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly appConfigEnvService: AppConfigEnvService) {
    super(appConfigEnvService.redisURI);
  }
  async onModuleInit() {
    await this.ping();
    console.log('Redis Connect !');
  }
  async onModuleDestroy() {
    await this.quit();
    console.log('Redis Disconnect !');
  }
}
