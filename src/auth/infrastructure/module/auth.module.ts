import { AuthController } from '@/auth/infrastructure/controller/auth.controller';
import { TokenModule } from '@/token/infrastructure/module/token.module';
import { UserModule } from '@/user/infrastructure/module/user.module';
import {
  IUserRepository,
  UserRepository,
} from '@/user/infrastructure/repository/user.repository';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EmailService,
  IEmailService,
} from '../../../core/application/service/email.service';
import { AppConfigEnvService } from '../../../core/domain/service/app-config-env.service';
import { RedisService } from '../../../core/domain/service/redis.service';
import { EmailModule } from '../../../core/infrastructure/module/email.module';
import { RedisServiceImplement } from '../../../core/infrastructure/service/redis.service';
import { ITokenService } from '../../../token/application/service/token.service';
import {
  CONFIG_SERVICE_PORT,
  ConfigServicePort,
} from '../../application/port/config-service.port';
import {
  EMAIL_SERVICE_PORT,
  EmailServicePort,
} from '../../application/port/email-service.port';
import {
  GENERATE_OTP_SERVICE_PORT,
  GenerateOtpServicePort,
} from '../../application/port/generate-otp-service.port';
import {
  REDIS_SERVICE_PORT,
  RedisServicePort,
} from '../../application/port/redis-service.port';
import {
  TOKEN_SERVICE_PORT,
  TokenServicePort,
} from '../../application/port/token-service.port';
import {
  USER_REPOSITORY_PORT,
  UserRepositoryPort,
} from '../../application/port/user-repository.port';
import {
  USER_VALIDATE_CREDENTIALS_SERVICE_PORT,
  UserValidateCredentialsServicePort,
} from '../../application/port/user-validate-credentials-service.port';
import { ActiveAccountUseCase } from '../../application/use-case/active-account.use-case';
import { LoginUseCase } from '../../application/use-case/login.user-case';
import { NewPasswordUseCase } from '../../application/use-case/new-password.use-case';
import { ResetPasswordUseCase } from '../../application/use-case/reset-password.use-case';
import { SendNewTokenToEmailActiveUseCase } from '../../application/use-case/send-new-token-to-email-active.use-case';
import { ConfigServiceAdapter } from '../adapter/config-service.adapter';
import { EmailServiceAdapter } from '../adapter/email-service.adapter';
import { GenerateOtpServiceAdapter } from '../adapter/generate-otp-service.adapter';
import { RedisServiceAdapter } from '../adapter/redis-service.adapter';
import { TokenServiceAdapter } from '../adapter/token-service.adapter';
import { UserValidateCredentialsServiceAdapter } from '../adapter/user-validate-credential-service.adapter';
import { UserRepositoryAdapter } from './../adapter/user-repository.adapter';

@Module({
  imports: [TokenModule, UserModule, EmailModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AppConfigEnvService,
      useFactory: (configService: ConfigService) =>
        new AppConfigEnvService(configService),
      inject: [ConfigService],
    },
    {
      provide: RedisService,
      useFactory: (appConfigEnvService: AppConfigEnvService) =>
        new RedisServiceImplement(appConfigEnvService),
      inject: [AppConfigEnvService],
    },
    {
      provide: USER_VALIDATE_CREDENTIALS_SERVICE_PORT,
      useFactory: (): UserValidateCredentialsServicePort =>
        new UserValidateCredentialsServiceAdapter(),
    },
    {
      provide: CONFIG_SERVICE_PORT,
      useFactory: (
        appConfigEnvService: AppConfigEnvService,
      ): ConfigServicePort => new ConfigServiceAdapter(appConfigEnvService),
      inject: [AppConfigEnvService],
    },
    {
      provide: TOKEN_SERVICE_PORT,
      useFactory: (tokenService: ITokenService): TokenServicePort =>
        new TokenServiceAdapter(tokenService),
      inject: [ITokenService],
    },
    {
      provide: USER_REPOSITORY_PORT,
      useFactory: (userRepository: IUserRepository): UserRepositoryPort =>
        new UserRepositoryAdapter(userRepository),
      inject: [UserRepository],
    },
    {
      provide: EMAIL_SERVICE_PORT,
      useFactory: (emailService: IEmailService): EmailServicePort =>
        new EmailServiceAdapter(emailService),
      inject: [EmailService],
    },
    {
      provide: REDIS_SERVICE_PORT,
      useFactory: (redisService: RedisService): RedisServicePort =>
        new RedisServiceAdapter(redisService),
      inject: [RedisService],
    },
    {
      provide: GENERATE_OTP_SERVICE_PORT,
      useFactory: (): GenerateOtpServicePort => new GenerateOtpServiceAdapter(),
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepositoryPort: UserRepositoryPort,
        userValidateCredentialsServicePort: UserValidateCredentialsServicePort,
        tokenServicePort: TokenServicePort,
        configServicePort: ConfigServicePort,
      ) =>
        new LoginUseCase(
          userRepositoryPort,
          userValidateCredentialsServicePort,
          tokenServicePort,
          configServicePort,
        ),
      inject: [
        USER_REPOSITORY_PORT,
        USER_VALIDATE_CREDENTIALS_SERVICE_PORT,
        TOKEN_SERVICE_PORT,
        CONFIG_SERVICE_PORT,
      ],
    },
    {
      provide: ActiveAccountUseCase,
      useFactory: (
        tokenServicePort: TokenServicePort,
        userRepositoryPort: UserRepositoryPort,
      ) => new ActiveAccountUseCase(tokenServicePort, userRepositoryPort),
      inject: [TOKEN_SERVICE_PORT, USER_REPOSITORY_PORT],
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (
        userRepositoryPort: UserRepositoryPort,
        emailServicePort: EmailServicePort,
        redisServicePort: RedisServicePort,
        generateOtpServicePort: GenerateOtpServicePort,
      ) =>
        new ResetPasswordUseCase(
          userRepositoryPort,
          emailServicePort,
          redisServicePort,
          generateOtpServicePort,
        ),
      inject: [
        USER_REPOSITORY_PORT,
        EMAIL_SERVICE_PORT,
        REDIS_SERVICE_PORT,
        GENERATE_OTP_SERVICE_PORT,
      ],
    },
    {
      provide: NewPasswordUseCase,
      useFactory: (
        redisServicePort: RedisServicePort,
        userRepositoryPort: UserRepositoryPort,
        userValidateCredentialsServicePort: UserValidateCredentialsServicePort,
      ) =>
        new NewPasswordUseCase(
          redisServicePort,
          userRepositoryPort,
          userValidateCredentialsServicePort,
        ),
      inject: [
        REDIS_SERVICE_PORT,
        USER_REPOSITORY_PORT,
        USER_VALIDATE_CREDENTIALS_SERVICE_PORT,
      ],
    },
    {
      provide: SendNewTokenToEmailActiveUseCase,
      useFactory: (
        tokenServicePort: TokenServicePort,
        userRepositoryPort: UserRepositoryPort,
        emailServicePort: EmailServicePort,
      ) =>
        new SendNewTokenToEmailActiveUseCase(
          tokenServicePort,
          userRepositoryPort,
          emailServicePort,
        ),
      inject: [TOKEN_SERVICE_PORT, USER_REPOSITORY_PORT, EMAIL_SERVICE_PORT],
    },
  ],
})
export class AuthModule {}
