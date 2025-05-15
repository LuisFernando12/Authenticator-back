import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controller/user.controller';
import { UserEntity } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { AppConfigEnvService } from 'src/service/app-config-env.service';
import { EmailService } from 'src/service/email.service';
import { UserService } from 'src/service/user.service';
import { TokenModule } from './token.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, EmailService, AppConfigEnvService],
})
export class UserModule {}
