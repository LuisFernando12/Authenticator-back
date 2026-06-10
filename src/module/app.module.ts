import { AuthModule } from '@/auth/infrastructure/module/auth.module';
import { ClientModule } from '@/client/infrastructure/module/client.module';
import { TokenModule } from '@/token/infrastructure/module/token.module';
import { UserModule } from '@/user/infrastructure/module/user.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../core/infrastructure/module/app-config.module';
import { EmailModule } from '../core/infrastructure/module/email.module';
import { HealthModule } from '../core/infrastructure/module/health.module';
import { OauthModule } from '../oauth/infrastructure/module/oauth.module';

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
          synchronize: false,
          autoLoadEntities: true,
          migrationsRun: true,
          invalidWhereValuesBehavior: {
            null: 'throw',
            undefined: 'throw',
          },
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
