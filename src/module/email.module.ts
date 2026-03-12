import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

import { AppConfigEnvService } from '@/service/app-config-env.service';
import { EmailService } from '@/service/email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SERVER_SMTP'),
          port: config.get<number>('SMTP_PORT'),
          auth: {
            user: config.get<string>('SERVER_SMTP_USER_NAME'),
            pass: config.get<string>('SERVER_SMTP_PASSWORD'),
          },
        },
        template: {
          dir: join(process.cwd(), '/src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService, AppConfigEnvService],
  exports: [EmailService],
})
export class EmailModule {}
