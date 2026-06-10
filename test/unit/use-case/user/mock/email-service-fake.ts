import {
  EmailServicePort,
  ISendActivationEmailPayload,
} from '@/user/application/port/email-service.port';

export class EmailServiceFake implements EmailServicePort {
  async sendActivationEmail(
    _emailPayload: ISendActivationEmailPayload,
  ): Promise<string> {
    return 'OK';
  }
}
