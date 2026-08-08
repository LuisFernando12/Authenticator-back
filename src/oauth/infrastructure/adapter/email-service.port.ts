import { EmailQueue } from '../../../email/infrastructure/queue/email.queue';
import {
  EmailServicePort,
  IBlockAccountPayload,
} from '../../application/port/email-service.port';

export class EmailServiceAdapter implements EmailServicePort {
  constructor(private readonly emailQueue: EmailQueue) {}
  async blockAccount(payload: IBlockAccountPayload): Promise<void> {
    this.emailQueue.add(
      { email: payload.email, username: payload.username, code: payload.code },
      'block-account',
    );
  }
}
