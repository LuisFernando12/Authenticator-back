import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { AppConfigEnvService } from 'src/service/app-config-env.service';
import * as j from 'joi';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: j.object({
        USER_DB: j.string().required(),
        DB_PASSWORD: j.string().required(),
        DB_NAME: j.string().required(),
        DB_PORT: j.number().default(5432),
        SERVICE_URL: j.string().required(),
        SMTP_PORT: j.number().required(),
        SERVER_SMTP: j.string().required(),
        SERVER_SMTP_USER_NAME: j.string().required(),
        SERVER_SMTP_PASSWORD: j.string().required(),
      }),
    }),
  ],
  providers: [AppConfigEnvService],
  exports: [AppConfigEnvService],
})
export class AppConfigModule {}
