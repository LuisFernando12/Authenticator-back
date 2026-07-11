import { EmailService } from '@/email/application/service/email.service';
import { handlebarsSplitCharsHelper } from '@/email/infrastructure/helper/handlebars-split-chars.helper';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { EmailQueue } from '../../../src/email/infrastructure/queue/email.queue';
import { EmailWorker } from '../../../src/email/infrastructure/worker/email.worker';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
      },
      template: {
        dir: join(process.cwd(), '/src/templates'),
        adapter: new HandlebarsAdapter(handlebarsSplitCharsHelper),
        options: {
          strict: true,
        },
      },
    }),
    BullModule.forRootAsync({
      useFactory: () => {
        const redisUriSplitted = process.env.REDIS_URI.split(':');
        const redisPort = redisUriSplitted.at(-1);
        const redisHost = redisUriSplitted[1].slice(2);
        return {
          connection: {
            host: redisHost,
            port: Number(redisPort),
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
    EmailQueue,
    EmailWorker,
  ],
  exports: [EmailQueue],
})
export class TestEmailModule {}
