import { ClientModule } from '@/client/infrastructure/module/client.module';
import { RedisService } from '@/core/domain/service/redis.service';
import { OauthController } from '@/oauth/infrastructure/controller/oauth.controller';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigEnvService } from '../../../core/domain/service/app-config-env.service';
import { RedisServiceImplement } from '../../../core/infrastructure/service/redis.service';
import { AppConfigModule } from '../../../module/app-config.module';
import { TokenModule } from '../../../module/token.module';
import { UserClientConsentModule } from '../../../module/user-client-consent.module';
import { UserModule } from '../../../module/user.module';
import { ITokenService, TokenService } from '../../../service/token.service';
import {
  IUserClientConsentService,
  UserClientConsentService,
} from '../../../service/user-client-consent.service';
import { IUserService, UserService } from '../../../service/user.service';
import {
  CLIENT_SERVICE_PORT,
  ClientServicePort,
} from '../../application/port/client-service.port';
import {
  CONFIG_SERVICE_PORT,
  ConfigServicePort,
} from '../../application/port/config-service.port';
import {
  HASHED_CLIENT_SECRET_SERVICE_PORT,
  HashedClientSecretServicePort,
} from '../../application/port/hashed-client-secret.port';
import {
  REDIS_SERVICE_PORT,
  RedisServicePort,
} from '../../application/port/redis-service-port';
import {
  TOKEN_SERVICE_PORT,
  TokenServicePort,
} from '../../application/port/token-service.port';
import {
  USER_CLIENT_CONSENT_SERVICE_PORT,
  UserClientConsentServicePort,
} from '../../application/port/user-client-consent-service.port';
import {
  USER_SERVICE_PORT,
  UserServicePort,
} from '../../application/port/user-service.port';
import { AuthorizeUseCase } from '../../application/use-case/authorize.use-case';
import { ExchangeOauthCodeUseCase } from '../../application/use-case/exchange-auth-code.use-case';
import { LoginUseCase } from '../../application/use-case/login.use-case';
import { RefreshTokenUseCase } from '../../application/use-case/refresh-token.use-case';
import { RevokeTokenUseCase } from '../../application/use-case/revoke-token.use-case';
import { TokenIntrospectUseCase } from '../../application/use-case/token-introspect.use-case';

import {
  ClientRepository,
  IClientRepository,
} from '../../../repository/client.repository';
import {
  GENERATE_ID_SERVICE_PORT,
  GenerateIdServicePort,
} from '../../application/port/generate-id-service.port';
import { ClientServiceAdapter } from '../adapter/client-service.adapter';
import { ConfigServiceAdapter } from '../adapter/config-service.adapter';
import { GenerateIdServiceAdapter } from '../adapter/generate-id-service.adapter';
import { HashedClientSecretServiceAdapter } from '../adapter/hashed-client-secret-service.adapter';
import { RedisServiceAdapter } from '../adapter/redis-service.adapter';
import { TokenServiceAdapter } from '../adapter/token-service.adapter';
import { UserClientConsentServiceAdapter } from '../adapter/user-client-consent-service.adapter';
import { UserServiceAdapter } from '../adapter/user-service.adapter';

@Module({
  imports: [
    ClientModule,
    UserModule,
    TokenModule,
    UserClientConsentModule,
    AppConfigModule,
  ],
  controllers: [OauthController],
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
      provide: CLIENT_SERVICE_PORT,
      useFactory: (clientRepository: IClientRepository): ClientServicePort =>
        new ClientServiceAdapter(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: USER_CLIENT_CONSENT_SERVICE_PORT,
      useFactory: (userClientConsentService: IUserClientConsentService) =>
        new UserClientConsentServiceAdapter(userClientConsentService),
      inject: [UserClientConsentService],
    },
    {
      provide: TOKEN_SERVICE_PORT,
      useFactory: (tokenService: ITokenService): TokenServicePort =>
        new TokenServiceAdapter(tokenService),
      inject: [TokenService],
    },
    {
      provide: REDIS_SERVICE_PORT,
      useFactory: (redisService: RedisService): RedisServicePort =>
        new RedisServiceAdapter(redisService),
      inject: [RedisService],
    },
    {
      provide: HASHED_CLIENT_SECRET_SERVICE_PORT,
      useFactory: (): HashedClientSecretServicePort =>
        new HashedClientSecretServiceAdapter(),
    },
    {
      provide: USER_SERVICE_PORT,
      useFactory: (userService: IUserService): UserServicePort =>
        new UserServiceAdapter(userService),
      inject: [UserService],
    },
    {
      provide: CONFIG_SERVICE_PORT,
      useFactory: (configService: AppConfigEnvService): ConfigServicePort =>
        new ConfigServiceAdapter(configService),
      inject: [AppConfigEnvService],
    },
    {
      provide: GENERATE_ID_SERVICE_PORT,
      useFactory: (): GenerateIdServicePort => new GenerateIdServiceAdapter(),
    },
    {
      provide: AuthorizeUseCase,
      useFactory: (
        clientServicePort: ClientServicePort,
        generateIdServicePort: GenerateIdServicePort,
        redisServicePort: RedisServicePort,
        configServicePort: ConfigServicePort,
      ) => {
        return new AuthorizeUseCase(
          clientServicePort,
          generateIdServicePort,
          redisServicePort,
          configServicePort,
        );
      },
      inject: [
        CLIENT_SERVICE_PORT,
        GENERATE_ID_SERVICE_PORT,
        REDIS_SERVICE_PORT,
        CONFIG_SERVICE_PORT,
      ],
    },
    {
      provide: ExchangeOauthCodeUseCase,
      useFactory: (
        clientServicePort: ClientServicePort,
        tokenServicePort: TokenServicePort,
        redisServicePort: RedisServicePort,
        hashedClientSecretServicePort: HashedClientSecretServicePort,
        userServicePort: UserServicePort,
        userClientConsentServicePort: UserClientConsentServicePort,
        configService: ConfigServicePort,
      ) => {
        return new ExchangeOauthCodeUseCase(
          clientServicePort,
          tokenServicePort,
          redisServicePort,
          hashedClientSecretServicePort,
          userServicePort,
          userClientConsentServicePort,
          configService,
        );
      },
      inject: [
        CLIENT_SERVICE_PORT,
        TOKEN_SERVICE_PORT,
        REDIS_SERVICE_PORT,
        HASHED_CLIENT_SECRET_SERVICE_PORT,
        USER_SERVICE_PORT,
        USER_CLIENT_CONSENT_SERVICE_PORT,
        CONFIG_SERVICE_PORT,
      ],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        redisServicePort: RedisServicePort,
        userServicePort: UserServicePort,
        userClientConsentServicePort: UserClientConsentServicePort,
        generateIdServicePort: GenerateIdServicePort,
      ) => {
        return new LoginUseCase(
          redisServicePort,
          userServicePort,
          userClientConsentServicePort,
          generateIdServicePort,
        );
      },
      inject: [
        REDIS_SERVICE_PORT,
        USER_SERVICE_PORT,
        USER_CLIENT_CONSENT_SERVICE_PORT,
        GENERATE_ID_SERVICE_PORT,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        tokenServicePort: TokenServicePort,
        userServicePort: UserServicePort,
        userClientConsentServicePort: UserClientConsentServicePort,
        configServicePort: ConfigServicePort,
      ) =>
        new RefreshTokenUseCase(
          tokenServicePort,
          userServicePort,
          userClientConsentServicePort,
          configServicePort,
        ),
      inject: [
        TOKEN_SERVICE_PORT,
        USER_SERVICE_PORT,
        USER_CLIENT_CONSENT_SERVICE_PORT,
        CONFIG_SERVICE_PORT,
      ],
    },
    {
      provide: RevokeTokenUseCase,
      useFactory: (
        tokenServicePort: TokenServicePort,
        redisServicePort: RedisServicePort,
      ) => new RevokeTokenUseCase(tokenServicePort, redisServicePort),
      inject: [TOKEN_SERVICE_PORT, REDIS_SERVICE_PORT],
    },
    {
      provide: TokenIntrospectUseCase,
      useFactory: (
        tokenServicePort: TokenServicePort,
        redisServicePort: RedisServicePort,
      ) => new TokenIntrospectUseCase(tokenServicePort, redisServicePort),
      inject: [TOKEN_SERVICE_PORT, REDIS_SERVICE_PORT],
    },
  ],
})
export class OauthModule {}
