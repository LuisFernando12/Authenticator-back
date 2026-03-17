import { TokenEntity } from '@/entity/token.entity';
import { UserEntity } from '@/entity/user.entity';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../entity/client.entity';
import { UserClientConsentEntity } from '../entity/user-client-consent.entity';
import { AppConfigModule } from './app-config.module';
import { AuthModule } from './auth.module';
import { ClientModule } from './client.module';
import { EmailModule } from './email.module';
import { HealthModule } from './health.module';
import { OauthModule } from './oauth.module';
import { TokenModule } from './token.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        port: config.get('DB_PORT'),
        username: config.get('USER_DB'),
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
      }),
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
