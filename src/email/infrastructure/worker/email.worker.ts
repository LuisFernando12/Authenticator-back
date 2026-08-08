import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  EMAIL_LOGGER_PORT,
  EmailLoggerPort,
} from '../../application/port/email-logger.port';
import { EmailService } from '../../application/service/email.service';
import { Email } from '../../domain/entity/email.entity';

@Processor('send-email')
export class EmailWorker extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    @Inject(EMAIL_LOGGER_PORT) private readonly logger: EmailLoggerPort,
  ) {
    super();
    this.logger.log('EmailWorker created', { context: 'EmailWorker' });
  }
  async process(job: Job<Email>): Promise<void> {
    try {
      this.logger.log('Processing job...', {});
      switch (job.name) {
        case 'activation':
          this.logger.log('Email to activation account', {});
          await this.emailService.sendActivationAccountEmail(job.data);
          break;
        case 'reset-password':
          this.logger.log('Email to reset password', {});
          await this.emailService.sendResetPasswordEmail(job.data);
          break;
        case 'block-account':
          this.logger.log('Email to block account', {});
          await this.emailService.sendBlockAccountEmail(job.data);
          break;
        case 'unblock-account':
          this.logger.log('Email to unblock account', {});
          await this.emailService.sendUnblockAccountEmail(job.data);
          break;
        default:
          this.logger.error('Email type not found', {});
          throw new Error('Email type not found');
      }

      this.logger.log(`Completed processing job with jobId: ${job.id}`, {});
    } catch (error: any) {
      this.logger.error(`Failed processing job with jobId: ${job.id}`, {
        errorStack: {
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        },
      });
      throw error;
    }
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job<Email>): void {
    this.logger.log(`Completed job with jobId: ${job.id}`, {});
  }
  @OnWorkerEvent('failed')
  onFailed(job: Job<Email> | undefined, error: Error): void {
    this.logger.error(`Failed job with jobId: ${job.id}`, {
      errorStack: {
        message: error?.message,
        stack: error?.stack,
        cause: error?.cause,
      },
    });
  }
}
