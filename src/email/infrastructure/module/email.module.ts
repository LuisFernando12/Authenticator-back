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
import { SendResetPasswordEmailUseCase } from '../../application/use-cases/send-reset-password-email';
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
