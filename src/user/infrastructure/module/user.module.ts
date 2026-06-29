import { TokenModule } from '@/token/infrastructure/module/token.module';
import {
  EMAIL_SERVICE_PORT,
  EmailServicePort,
} from '@/user/application/port/email-service.port';
import {
  ENCRYPT_SERVICE_PORT,
  EncryptServicePort,
} from '@/user/application/port/encrypt-service.port';
import {
  TOKEN_SERVICE_PORT,
  TokenServicePort,
} from '@/user/application/port/token-service.port';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '@/user/application/port/user-repository.port';
import { EncryptServiceAdapter } from '@/user/infrastructure/adapter/encrypt-service.adapter';
import { UserController } from '@/user/infrastructure/controller/user.controller';
import { UserEntity } from '@/user/infrastructure/persistence/entity/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../../../core/application/service/email.service';
import { EmailModule } from '../../../core/infrastructure/module/email.module';

import { TokenService } from '../../../token/application/service/token.service';
import { FindUserByEmailUseCase } from '../../application/use-case/find-user-by-email.use-case';
import { RegisterUserUseCase } from '../../application/use-case/register-user.use-case';
import { EmailServiceAdapter } from '../adapter/email-service.adapter';
import { TokenServiceAdapter } from '../adapter/token-service.adapter';
import { UserRepositoryAdapter } from '../adapter/user-repository.adapter';
import { UserRepository } from '../repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokenModule, EmailModule],
  controllers: [UserController],
  providers: [
    UserRepository,
    {
      provide: EMAIL_SERVICE_PORT,
      useFactory: (emailService: EmailService): EmailServicePort =>
        new EmailServiceAdapter(emailService),
      inject: [EmailService],
    },
    {
      provide: ENCRYPT_SERVICE_PORT,
      useFactory: (): EncryptServicePort => new EncryptServiceAdapter(),
      inject: [],
    },
    {
      provide: TOKEN_SERVICE_PORT,
      useFactory: (tokenService: TokenService): TokenServicePort =>
        new TokenServiceAdapter(tokenService),
      inject: [TokenService],
    },
    {
      provide: USER_REPOSITORY_PORT,
      useFactory: (userRepository: UserRepository): UserRepositoryPort =>
        new UserRepositoryAdapter(userRepository),
      inject: [UserRepository],
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (
        userRepositoryPort: UserRepositoryPort,
        encryptServicePort: EncryptServicePort,
        emailServicePort: EmailServicePort,
        tokenServicePort: TokenServicePort,
      ): RegisterUserUseCase =>
        new RegisterUserUseCase(
          userRepositoryPort,
          encryptServicePort,
          emailServicePort,
          tokenServicePort,
        ),
      inject: [
        USER_REPOSITORY_PORT,
        ENCRYPT_SERVICE_PORT,
        EMAIL_SERVICE_PORT,
        TOKEN_SERVICE_PORT,
      ],
    },
    {
      provide: FindUserByEmailUseCase,
      useFactory: (
        userRepositoryPort: UserRepositoryPort,
      ): FindUserByEmailUseCase =>
        new FindUserByEmailUseCase(userRepositoryPort),
      inject: [USER_REPOSITORY_PORT],
    },
  ],
  exports: [FindUserByEmailUseCase, UserRepository],
})
export class UserModule {}
