import { AuthModule } from '@/auth/infrastructure/module/auth.module';
import { ClientModule } from '@/client/infrastructure/module/client.module';
import { TokenEntity } from '@/entity/token.entity';
import { UserEntity } from '@/entity/user.entity';
import { UserModule } from '@/user/infrastructure/module/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../entity/client.entity';
import { UserClientConsentEntity } from '../entity/user-client-consent.entity';
import { OauthModule } from '../oauth/infrastructure/module/oauth.module';
import { AppConfigModule } from './app-config.module';
import { EmailModule } from './email.module';
import { HealthModule } from './health.module';
import { TokenModule } from './token.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [
            UserEntity,
            TokenEntity,
            ClientEntity,
            UserClientConsentEntity,
          ],
          synchronize: false,
          autoLoadEntities: true,
          migrationsRun: true,
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: 60000,
            limit: 5,
          },
        ],
        errorMessage: 'Too many requests, please try again later.',
      }),
    }),
    AuthModule,
    UserModule,
    TokenModule,
    EmailModule,
    ClientModule,
    OauthModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
