import { EmailQueue } from '../../../email/infrastructure/queue/email.queue';
import {
  EmailServicePort,
  ISendActivationEmailPayload,
} from '../../application/port/email-service.port';
import { UserDomainError } from '../../domain/error/user-domain.error';

export class EmailServiceAdapter implements EmailServicePort {
  constructor(private readonly emailQueue: EmailQueue) {}
  async sendActivationEmail(
    emailPayload: ISendActivationEmailPayload,
  ): Promise<string> {
    try {
      await this.emailQueue.add(
        {
          email: emailPayload.email,
          username: emailPayload.name,
          token: emailPayload.token,
        } as any,
        'activation',
      );

      return 'OK';
    } catch {
      throw UserDomainError.internalServerError('Failure to send email');
    }
  }
}
