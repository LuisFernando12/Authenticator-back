import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EmailProps } from '../../domain/entity/email.entity';

export type EmailQueueName = 'activation' | 'reset-password';
export type EmailQueuePayload = EmailProps;

export class EmailQueue {
  constructor(@InjectQueue('send-email') private readonly emailQueue: Queue) {}
  async add(payload: EmailQueuePayload, name: EmailQueueName) {
    await this.emailQueue.add(name, payload);
  }
  async remove(jobId: string) {
    await this.emailQueue.remove(jobId);
  }
}
