import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controller/auth.controller';
import { UserEntity } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { AuthService } from 'src/service/auth.service';
import { TokenModule } from './token.module';
import { EmailModule } from './email.module';
import { RedisService } from 'src/service/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RedisService],
})
export class AuthModule {}
