import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import * as j from 'joi';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: j.object({
        DB_HOST: j.string().required(),
        DB_USER: j.string().required(),
        DB_PASSWORD: j.string().required(),
        DB_NAME: j.string().required(),
        DB_PORT: j.number().default(5432),
        SECRET: j.string().required(),
        SERVICE_URL: j.string().required(),
        GMAIL_CLIENT_ID: j.string().required(),
        GMAIL_CLIENT_SECRET: j.string().required(),
        GMAIL_REDIRECT_URI: j.string().required(),
        GMAIL_REFRESH_TOKEN: j.string().required(),
        GMAIL_SENDER_EMAIL: j.string().required(),
        OAUTH_LOGIN_URL: j.string().required(),
        REDIS_URI: j.string().required(),
        SERVICE_RESET_PASSWORD_URL: j.string().required(),
        SERVICE_VERIFY_EMAIL_URL: j.string().required(),
        REDIRECT_URI: j.string().required(),
        CLIENT_SECRET_PEPPER: j.string().required(),
        ACCESS_TOKEN_EXPIRES_IN: j.string().default('15min'),
        REFRESH_TOKEN_EXPIRES_DAYS: j.number().default(15),
        EMAIL_VERIFICATION_TOKEN_EXPIRES: j.string().default('6h'),
        PASSWORD_RESET_TOKEN_EXPIRES: j.string().default('1h'),
      }),
    }),
  ],
  providers: [AppConfigEnvService],
  exports: [AppConfigEnvService, ConfigModule],
})
export class AppConfigModule {}
