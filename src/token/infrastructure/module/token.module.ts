import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { TokenEntity } from '@/token/infrastructure/persistence/entity/token.entity';
import { TokenRepository } from '@/token/infrastructure/repository/token.repository';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../../../core/infrastructure/module/app-config.module';
import {
  CONFIG_SERVICE_PORT,
  ConfigServicePort,
} from '../../application/port/config-service.port';
import {
  GENERATE_JTI_PORT,
  GenerateJtiPort,
} from '../../application/port/generate-jti.port';
import {
  JWT_SERVICE_PORT,
  JwtServicePort,
} from '../../application/port/jwt-service.port';
import {
  REFRESH_TOKEN_SERVICE_PORT,
  RefreshTokenServicePort,
} from '../../application/port/refresh-token-service.port';
import {
  TOKEN_REPOSITORY_PORT,
  TokenRepositoryPort,
} from '../../application/port/token-repository.port';
import {
  ITokenService,
  TokenService,
} from '../../application/service/token.service';
import { FindByRefreshTokenUseCase } from '../../application/use-case/find-by-refresh-token.use-case';
import { GenerateEmailVerificationTokenUseCase } from '../../application/use-case/generate-email-verification-token.use-case';
import { GenerateTokenUseCase } from '../../application/use-case/generate-token.use-case';
import { RefreshTokenUseCase } from '../../application/use-case/refresh-token.use-case';
import { RevokeTokenUseCase } from '../../application/use-case/revoke-token.use-case';
import { TokenIntrospectUseCase } from '../../application/use-case/token-introspect.use-case';
import { ConfigServiceAdapter } from '../adapter/config-service.adapter';
import { GenerateJtiAdapter } from '../adapter/generate-jti.adapter';
import { JwtServiceAdapter } from '../adapter/jwt-service.adapter';
import { RefreshTokenServiceAdapter } from '../adapter/refresh-token-service.adapter';
import { TokenRepositoryAdapter } from '../adapter/token-repository.adapter';
import { VerifyTokenUseCase } from './../../application/use-case/verify-token.use-case';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigEnvService],
      useFactory: (config: AppConfigEnvService) => ({
        global: true,
        secret: config.secret,
        signOptions: {
          expiresIn: '60s',
        },
      }),
    }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [
    TokenRepository,
    {
      provide: CONFIG_SERVICE_PORT,
      useFactory: (configService: AppConfigEnvService): ConfigServicePort =>
        new ConfigServiceAdapter(configService),
      inject: [AppConfigEnvService],
    },
    {
      provide: GENERATE_JTI_PORT,
      useFactory: (): GenerateJtiPort => new GenerateJtiAdapter(),
    },
    {
      provide: REFRESH_TOKEN_SERVICE_PORT,
      useFactory: (): RefreshTokenServicePort =>
        new RefreshTokenServiceAdapter(),
    },
    {
      provide: TOKEN_REPOSITORY_PORT,
      useFactory: (tokenRepository: TokenRepository): TokenRepositoryPort =>
        new TokenRepositoryAdapter(tokenRepository),
      inject: [TokenRepository],
    },
    {
      provide: JWT_SERVICE_PORT,
      useFactory: (
        jwtService: JwtService,
        appConfigEnvService: AppConfigEnvService,
      ): JwtServicePort =>
        new JwtServiceAdapter(jwtService, appConfigEnvService),
      inject: [JwtService, AppConfigEnvService],
    },
    {
      provide: FindByRefreshTokenUseCase,
      useFactory: (tokenRepositoryPort: TokenRepositoryPort) =>
        new FindByRefreshTokenUseCase(tokenRepositoryPort),
      inject: [TOKEN_REPOSITORY_PORT],
    },
    {
      provide: GenerateEmailVerificationTokenUseCase,
      useFactory: (
        jwtServicePort: JwtServicePort,
        configServicePort: ConfigServicePort,
      ) =>
        new GenerateEmailVerificationTokenUseCase(
          jwtServicePort,
          configServicePort,
        ),
      inject: [JWT_SERVICE_PORT, CONFIG_SERVICE_PORT],
    },
    {
      provide: RevokeTokenUseCase,
      useFactory: (tokenRepositoryPort: TokenRepositoryPort) =>
        new RevokeTokenUseCase(tokenRepositoryPort),
      inject: [TOKEN_REPOSITORY_PORT],
    },
    {
      provide: TokenIntrospectUseCase,
      useFactory: (verifyTokenUseCase: VerifyTokenUseCase) =>
        new TokenIntrospectUseCase(verifyTokenUseCase),
      inject: [VerifyTokenUseCase],
    },
    {
      provide: VerifyTokenUseCase,
      useFactory: (jwtServicePort: JwtServicePort) =>
        new VerifyTokenUseCase(jwtServicePort),
      inject: [JWT_SERVICE_PORT],
    },
    {
      provide: GenerateTokenUseCase,
      useFactory: (
        tokenRepositoryPort: TokenRepositoryPort,
        configServicePort: ConfigServicePort,
        jwtServicePort: JwtServicePort,
        generateTokensServicePort: RefreshTokenServicePort,
        generateJtiPort: GenerateJtiPort,
      ) =>
        new GenerateTokenUseCase(
          tokenRepositoryPort,
          configServicePort,
          jwtServicePort,
          generateTokensServicePort,
          generateJtiPort,
        ),
      inject: [
        TOKEN_REPOSITORY_PORT,
        CONFIG_SERVICE_PORT,
        JWT_SERVICE_PORT,
        REFRESH_TOKEN_SERVICE_PORT,
        GENERATE_JTI_PORT,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        tokenRepositoryPort: TokenRepositoryPort,
        configServicePort: ConfigServicePort,
        jwtServicePort: JwtServicePort,
        refreshTokenServicePort: RefreshTokenServicePort,
        generateJtiPort: GenerateJtiPort,
      ) =>
        new RefreshTokenUseCase(
          tokenRepositoryPort,
          configServicePort,
          jwtServicePort,
          refreshTokenServicePort,
          generateJtiPort,
        ),
      inject: [
        TOKEN_REPOSITORY_PORT,
        CONFIG_SERVICE_PORT,
        JWT_SERVICE_PORT,
        REFRESH_TOKEN_SERVICE_PORT,
        GENERATE_JTI_PORT,
      ],
    },
    {
      provide: ITokenService,
      useFactory: (
        generateTokenUseCase: GenerateTokenUseCase,
        refreshTokenUseCase: RefreshTokenUseCase,
        revokeTokenUseCase: RevokeTokenUseCase,
        tokenIntrospectUseCase: TokenIntrospectUseCase,
        verifyTokenUseCase: VerifyTokenUseCase,
        findByRefreshTokenUseCase: FindByRefreshTokenUseCase,
        generateEmailVerificationTokenUseCase: GenerateEmailVerificationTokenUseCase,
      ): ITokenService =>
        new TokenService(
          generateTokenUseCase,
          refreshTokenUseCase,
          revokeTokenUseCase,
          tokenIntrospectUseCase,
          verifyTokenUseCase,
          findByRefreshTokenUseCase,
          generateEmailVerificationTokenUseCase,
        ),
      inject: [
        GenerateTokenUseCase,
        RefreshTokenUseCase,
        RevokeTokenUseCase,
        TokenIntrospectUseCase,
        VerifyTokenUseCase,
        FindByRefreshTokenUseCase,
        GenerateEmailVerificationTokenUseCase,
      ],
    },
  ],
  exports: [ITokenService, TokenRepository],
})
export class TokenModule {}
