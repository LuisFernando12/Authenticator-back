import { TokenEntity } from '@/entity/token.entity';
import { TokenRepository } from '@/repository/token.repository';
import { AppConfigEnvService } from '@/service/app-config-env.service.deprecated';
import { TokenService } from '@/service/token.service.deprecated';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './app-config.module';
import { AuthLoggerModule } from './auth-logger.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule, AuthLoggerModule],
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
  providers: [TokenService, TokenRepository, AppConfigEnvService],
  exports: [TokenService, TokenRepository, JwtModule],
})
export class TokenModule {}
