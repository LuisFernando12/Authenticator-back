import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailLoggerPort } from '../../application/port/email-logger.port';
import { EmailService } from '../../application/service/email.service';
import { Email } from '../../domain/entity/email.entity';
import { EmailDomainError } from '../../domain/error/email-domain.error';

@Processor('send-email')
export class EmailWorker extends WorkerHost {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: EmailLoggerPort,
  ) {
    super();
    this.logger.log('EmailWorker created', { context: 'EmailWorker' });
  }
  async process(job: Job<Email>): Promise<void> {
    this.logger.log('Processing job...', {});
    if (job.name === 'reset-password') {
      this.logger.log('Email to reset password', {});
      await this.emailService.sendResetPasswordEmail(job.data);
    }
    if (job.name === 'activation') {
      this.logger.log('Email to activation account', {});
      await this.emailService.sendActivationAccountEmail(job.data);
    }
    job
      .isFailed()
      .then((isFailed) => {
        if (isFailed) {
          this.logger.log(`Failed processing job with jobId: ${job.id}`, {
            errorStack: { cause: job.failedReason },
          });
          job.log(`Failed processing job with jobId: ${job.id}`);
          return;
        }
        this.logger.log(`Completed processing job with jobId: ${job.id}`, {});
        job.log('Completed processing job');
        job.updateProgress(Number(job.progress) + 1);
      })
      .catch((error) => {
        this.logger.error(`Failed processing job with jobId: ${job.id}`, {
          errorStack: { cause: error },
        });
        throw EmailDomainError.internalServerError(
          'Failure processing job on worker',
        );
      });
  }
}
