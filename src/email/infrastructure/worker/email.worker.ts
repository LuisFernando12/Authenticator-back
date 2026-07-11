import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService } from '../../application/service/email.service';
import { Email } from '../../domain/entity/email.entity';

@Processor('send-email')
export class EmailWorker extends WorkerHost {
  constructor(private readonly emailService: EmailService) {
    super();
  }
  async process(job: Job<Email>): Promise<void> {
    job.log('Processing job...');
    if (job.name === 'reset-password') {
      await this.emailService.sendResetPasswordEmail(job.data);
    }
    if (job.name === 'activation') {
      await this.emailService.sendActivationAccountEmail(job.data);
    }
    job.isFailed().then((isFailed) => {
      if (isFailed) {
        job.log(`Failed processing job with jobId: ${job.id}`);
        return;
      }
      job.log('Completed processing job');
      job.updateProgress(Number(job.progress) + 1);
    });
  }
}
