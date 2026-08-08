import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthenticatorLogger } from '../../../config/logger/auth-logger.config';
import { AuthenticatorLoggerModule } from '../../../core/infrastructure/module/auth-logger.module';
import {
  CONFIG_SERVICE_PORT,
  ConfigServicePort,
} from '../../application/port/config-service.port';
import {
  EMAIL_LOGGER_PORT,
  EmailLoggerPort,
} from '../../application/port/email-logger.port';
import {
  MAILER_SERVICE_PORT,
  MailerServicePort,
} from '../../application/port/mailer-service.port';
import {
  EmailService,
  EmailServiceImpls,
} from '../../application/service/email.service';
import { SendActivationAccountEmailUseCase } from '../../application/use-cases/send-activation-account-email.use-case';
import { SendBlockAccountEmailUseCase } from '../../application/use-cases/send-block-account-email.use-case';
import { SendResetPasswordEmailUseCase } from '../../application/use-cases/send-reset-password-email';
import { SendUnblockAccountEmailUseCase } from '../../application/use-cases/send-unblock-account-email.use-case';
import { EmailLoggerAdapter } from '../adapter/email-logger.adapter';
import { MailerServiceAdapter } from '../adapter/mailer-service.adapter';
import { EMAIL_PROVIDE, EmailProvide } from '../email-provide/email.provide';
import { GmailProvide } from '../email-provide/gmail.provide';
import { EmailQueue } from '../queue/email.queue';
import {
  HANDLEBARS_RENDER,
  HandlebarsRender,
} from '../templates/handlebars.render';
import { EmailWorker } from '../worker/email.worker';
@Module({
  imports: [
    AuthenticatorLoggerModule,
    BullModule.forRootAsync({
      useFactory: (config: AppConfigEnvService) => {
        const redisURI = config.redisURI;
        if (!redisURI) {
          throw new Error('REDIS_URI is required for bullmq');
        }
        const redisUrl = new URL(redisURI);
        const redisHost = redisUrl.hostname;
        const redisPort = redisUrl.port;
        const redisPassword = redisUrl.password;
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
      provide: EMAIL_PROVIDE,
      useFactory: (configService: AppConfigEnvService): EmailProvide => {
        return new GmailProvide(configService);
      },
      inject: [AppConfigEnvService],
    },
    {
      provide: HANDLEBARS_RENDER,
      useFactory: (configService: ConfigService): HandlebarsRender =>
        new HandlebarsRender({
          nodeEnv: configService.getOrThrow<string>('NODE_ENV'),
        }),
      inject: [ConfigService],
    },
    {
      provide: MAILER_SERVICE_PORT,
      useFactory: (
        mailerProvide: EmailProvide,
        handlebarsRender: HandlebarsRender,
      ): MailerServicePort => {
        return new MailerServiceAdapter(mailerProvide, handlebarsRender);
      },
      inject: [EMAIL_PROVIDE, HANDLEBARS_RENDER],
    },
    {
      provide: CONFIG_SERVICE_PORT,
      useFactory: (config: AppConfigEnvService): ConfigServicePort => {
        return {
          serviceVerifyEmailURL: config.serviceVerifyEmailURL,
          serviceResetPasswordUrl: config.serviceResetPasswordUrl,
          serviceUnblockAccountUrl: config.serviceUnblockAccountUrl,
        };
      },
      inject: [AppConfigEnvService],
    },
    {
      provide: EMAIL_LOGGER_PORT,
      useFactory: (logger: AuthenticatorLogger): EmailLoggerPort =>
        new EmailLoggerAdapter(logger),
      inject: [AuthenticatorLogger],
    },
    {
      provide: SendActivationAccountEmailUseCase,
      useFactory: (
        mailerServicePort: MailerServicePort,
        configEnv: ConfigServicePort,
        emailLoggerPort: EmailLoggerPort,
      ) =>
        new SendActivationAccountEmailUseCase(
          mailerServicePort,
          configEnv,
          emailLoggerPort,
        ),
      inject: [MAILER_SERVICE_PORT, CONFIG_SERVICE_PORT, EMAIL_LOGGER_PORT],
    },
    {
      provide: SendResetPasswordEmailUseCase,
      useFactory: (
        mailerServicePort: MailerServicePort,
        configEnv: ConfigServicePort,
        emailLoggerPort: EmailLoggerPort,
      ) =>
        new SendResetPasswordEmailUseCase(
          mailerServicePort,
          configEnv,
          emailLoggerPort,
        ),
      inject: [MAILER_SERVICE_PORT, CONFIG_SERVICE_PORT, EMAIL_LOGGER_PORT],
    },
    {
      provide: SendBlockAccountEmailUseCase,
      useFactory: (
        mailerServicePort: MailerServicePort,
        configEnv: ConfigServicePort,
        emailLoggerPort: EmailLoggerPort,
      ) =>
        new SendBlockAccountEmailUseCase(
          mailerServicePort,
          configEnv,
          emailLoggerPort,
        ),
      inject: [MAILER_SERVICE_PORT, CONFIG_SERVICE_PORT, EMAIL_LOGGER_PORT],
    },
    {
      provide: SendUnblockAccountEmailUseCase,
      useFactory: (
        mailerServicePort: MailerServicePort,
        emailLoggerPort: EmailLoggerPort,
      ) =>
        new SendUnblockAccountEmailUseCase(mailerServicePort, emailLoggerPort),
      inject: [MAILER_SERVICE_PORT, EMAIL_LOGGER_PORT],
    },
    {
      provide: EmailService,
      useFactory: (
        sendActivationAccountEmailUseCase: SendActivationAccountEmailUseCase,
        sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase,
        sendBlockAccountEmailUseCase: SendBlockAccountEmailUseCase,
        sendUnblockAccountEmailUseCase: SendUnblockAccountEmailUseCase,
      ): EmailService =>
        new EmailServiceImpls(
          sendActivationAccountEmailUseCase,
          sendResetPasswordEmailUseCase,
          sendBlockAccountEmailUseCase,
          sendUnblockAccountEmailUseCase,
        ),
      inject: [
        SendActivationAccountEmailUseCase,
        SendResetPasswordEmailUseCase,
        SendBlockAccountEmailUseCase,
        SendUnblockAccountEmailUseCase,
      ],
    },
    EmailWorker,
    EmailQueue,
  ],
  exports: [EmailQueue],
})
export class EmailModule {}
