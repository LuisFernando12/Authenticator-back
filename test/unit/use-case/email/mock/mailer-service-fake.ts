import {
  ISendEmailPayload,
  MailerServicePort,
} from '@/email/application/port/mailer-service.port';

export class MailerServiceFake implements MailerServicePort {
  async sendMail(_payload: ISendEmailPayload): Promise<void> {
    return Promise.resolve();
  }
}
