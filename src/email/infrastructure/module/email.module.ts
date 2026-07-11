import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { handlebarsSplitCharsHelper } from '@/email/infrastructure/helper/handlebars-split-chars.helper';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'node:path';
import {
  CONFIG_SERVICE_PORT,
  ConfigServicePort,
} from '../../application/port/config-service.port';
import {
  MAILER_SERVICE_PORT,
  MailerServicePort,
} from '../../application/port/mailer-service.port';
import {
  EmailService,
  EmailServiceImpls,
} from '../../application/service/email.service';
import { SendActivationAccountEmailUseCase } from '../../application/use-cases/send-activation-account-email.use-case';
import { SendResetPasswordEmailUseCase } from '../../application/use-cases/send-reset-password-email';
import { MailerServiceAdapter } from '../adapter/mailer-service.adapter';
import { EmailQueue } from '../queue/email.queue';
import { EmailWorker } from '../worker/email.worker';
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [AppConfigEnvService],
      useFactory: (config: AppConfigEnvService) => ({
        transport: {
          host: config.serverSMTP,
          port: config.smtpPORT,
          auth: {
            user: config.serverSMTPUserName,
            pass: config.serverSMTPPassword,
          },
        },
        template: {
          dir: join(
            process.cwd(),
            (config.nodeEnv !== 'dev' ? 'dist/' : '') + 'src/config/templates',
          ),
          adapter: new HandlebarsAdapter(handlebarsSplitCharsHelper),
          options: {
            strict: true,
          },
        },
      }),
    }),
    BullModule.forRootAsync({
      useFactory: (config: AppConfigEnvService) => {
        const redisUriSplit = config.redisURI.split('@');
        const redisPassword = redisUriSplit[0].split('://:')[1];
        const redisHost = redisUriSplit[1].split(':')[0];
        const redisPort = redisUriSplit[1].split(':')[1];
        return {
          connection: {
            host: redisHost,
            port: Number(redisPort) || 6379,
            password: redisPassword,
          },
        };
      },
      inject: [AppConfigEnvService],
    }),
    BullModule.registerQueue({
      name: 'send-email',
    }),
  ],
  providers: [
    {
      provide: MAILER_SERVICE_PORT,
      useFactory: (mailerService: MailerService): MailerServicePort => {
        return new MailerServiceAdapter(mailerService);
      },
      inject: [MailerService],
    },
    {
      provide: CONFIG_SERVICE_PORT,
      useFactory: (config: ConfigService): ConfigServicePort => {
        return {
          serviceVerifyEmailURL: config.getOrThrow<string>(
            'SERVICE_VERIFY_EMAIL_URL',
          ),
          serviceResetPasswordUrl: config.getOrThrow<string>(
            'SERVICE_RESET_PASSWORD_URL',
          ),
        };
      },
      inject: [ConfigService],
    },
    {
      provide: SendActivationAccountEmailUseCase,
      useFactory: (
        mailerServicePort: MailerServicePort,
        configEnv: ConfigServicePort,
      ) => new SendActivationAccountEmailUseCase(mailerServicePort, configEnv),
      inject: [MAILER_SERVICE_PORT, CONFIG_SERVICE_PORT],
    },
    {
      provide: SendResetPasswordEmailUseCase,
      useFactory: (
        mailerServicePort: MailerServicePort,
        configEnv: ConfigServicePort,
      ) => new SendResetPasswordEmailUseCase(mailerServicePort, configEnv),
      inject: [MAILER_SERVICE_PORT, CONFIG_SERVICE_PORT],
    },
    {
      provide: EmailService,
      useFactory: (
        sendActivationAccountEmailUseCase: SendActivationAccountEmailUseCase,
        sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase,
      ): EmailService =>
        new EmailServiceImpls(
          sendActivationAccountEmailUseCase,
          sendResetPasswordEmailUseCase,
        ),
      inject: [
        SendActivationAccountEmailUseCase,
        SendResetPasswordEmailUseCase,
      ],
    },
    EmailWorker,
    EmailQueue,
  ],
  exports: [EmailQueue],
})
export class EmailModule {}
