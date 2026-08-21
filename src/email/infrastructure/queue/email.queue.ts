import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailProps } from '../../domain/entity/email.entity';
import { EmailDomainError } from '../../domain/error/email-domain.error';

export type EmailQueueName =
  | 'activation'
  | 'reset-password'
  | 'block-account'
  | 'unblock-account';
export type EmailQueuePayload = EmailProps;

export class EmailQueue {
  constructor(@InjectQueue('send-email') private readonly emailQueue: Queue) {}
  async add(payload: EmailQueuePayload, name: EmailQueueName) {
    try {
      await this.emailQueue.add(name, payload);
    } catch {
      throw EmailDomainError.internalServerError(
        'Failure to add email on queue',
      );
    }
  }
  async remove(jobId: string) {
    await this.emailQueue.remove(jobId);
  }
}
