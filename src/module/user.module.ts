import { UserController } from '@/controller/user.controller';
import { UserEntity } from '@/entity/user.entity';
import { UserRepository } from '@/repository/user.repository';
import { AppConfigEnvService } from '@/service/app-config-env.service';
import { EmailService } from '@/service/email.service';
import { UserService } from '@/service/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from './token.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, EmailService, AppConfigEnvService],
  exports: [UserService, UserRepository],
})
export class UserModule {}
