import { Module } from '@nestjs/common';
import { OauthController } from '../controller/oauth.controller';
import { OauthService } from '../service/oauth.service';
import { RedisService } from '../service/redis.service';
import { ClientModule } from './client.module';
import { TokenModule } from './token.module';
import { UserModule } from './user.module';

@Module({
  imports: [ClientModule, UserModule, TokenModule],
  controllers: [OauthController],
  providers: [OauthService, RedisService],
})
export class OauthModule {}
