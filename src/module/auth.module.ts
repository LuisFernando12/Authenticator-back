import { AuthController } from '@/controller/auth.controller';
import { UserEntity } from '@/entity/user.entity';
import { UserRepository } from '@/repository/user.repository';
import { AppConfigEnvService } from '@/service/app-config-env.service';
import { AuthService } from '@/service/auth.service';
import { RedisService } from '@/service/redis.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from './email.module';
import { TokenModule } from './token.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EmailModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RedisService, AppConfigEnvService],
})
export class AuthModule {}
