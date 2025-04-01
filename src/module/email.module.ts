import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailService } from 'src/service/email.service';
import { ConfigService } from '@nestjs/config';
import { AppConfigEnvService } from 'src/service/app-config-env.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
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
