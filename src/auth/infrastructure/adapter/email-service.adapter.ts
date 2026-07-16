import { EmailQueue } from '../../../email/infrastructure/queue/email.queue';
import {
  EmailServicePort,
  IResetPasswordPayload,
  ISendActivationEmailPayload,
} from '../../application/port/email-service.port';

export class EmailServiceAdapter implements EmailServicePort {
  constructor(private readonly emailQueue: EmailQueue) {}
  async sendActivationEmail(
    payload: ISendActivationEmailPayload,
  ): Promise<void> {
    const { email, name, token } = payload;

    await this.emailQueue.add(
      {
        email,
        username: name,
        token,
      },
      'activation',
    );
  }
  async resetPassword(payload: IResetPasswordPayload): Promise<void> {
    const { email, name, code } = payload;

    await this.emailQueue.add(
      {
        email,
        username: name,
        code,
      },
      'reset-password',
    );
  }
}
