import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import * as net from 'node:net';
import { EmailLoggerPort } from '../../application/port/email-logger.port';
import { EmailService } from '../../application/service/email.service';
import { Email } from '../../domain/entity/email.entity';

@Processor('send-email')
export class EmailWorker extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: EmailLoggerPort,
  ) {
    super();
    this.logger.log('EmailWorker created', { context: 'EmailWorker' });
    // Check if the SMTP server is reachable, important remove after
    const socket = net.createConnection({
      host: 'smtp.gmail.com',
      port: 465,
    });

    socket.on('connect', () => {
      console.log('SMTP successfully reachable');
      socket.destroy();
    });

    socket.on('error', (err) => {
      console.error('SMTP connection failed', err);
    });
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
