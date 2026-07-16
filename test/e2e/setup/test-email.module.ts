import { EmailService } from '@/email/application/service/email.service';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import {
  EMAIL_LOGGER_PORT,
  EmailLoggerPort,
} from '../../../src/email/application/port/email-logger.port';
import { EmailQueue } from '../../../src/email/infrastructure/queue/email.queue';
import { EmailWorker } from '../../../src/email/infrastructure/worker/email.worker';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => {
        const redisURI = process.env.REDIS_URI;

        if (!redisURI) {
          throw new Error('REDIS_URI is required for e2e tests');
        }

        const redisURL = new URL(redisURI);

        return {
          connection: {
            host: redisURL.hostname,
            port: Number(redisURL.port) || 6379,
            password: redisURL.password || undefined,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'send-email',
    }),
  ],
  providers: [
    {
      provide: EmailService,
      useValue: {
        sendActivationAccountEmail: jest.fn(),
        sendResetPasswordEmail: jest.fn(),
      },
    },
    {
      provide: EMAIL_LOGGER_PORT,
      useValue: {
        log: jest.fn(),
        error: jest.fn(),
        warn: jest.fn(),
      },
    },
    EmailQueue,
    {
      provide: EmailWorker,
      useFactory: (emailService: EmailService, logger: EmailLoggerPort) =>
        new EmailWorker(emailService, logger),
      inject: [EmailService, EMAIL_LOGGER_PORT],
    },
  ],
  exports: [EmailQueue],
})
export class TestEmailModule {}
