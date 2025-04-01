import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      password: 'redis',
    });
  }
  async onModuleInit() {
    await this.ping();
    console.log('Redis Connect !');
  }
  async onModuleDestroy() {
    await this.quit();
    console.log('Redis Desconnect !');
  }
}
