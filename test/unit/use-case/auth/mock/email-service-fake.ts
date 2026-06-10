import {
  EmailServicePort,
  IResetPasswordPayload,
  ISendActivationEmailPayload,
} from '@/auth/application/port/email-service.port';

export class EmailServiceFake implements EmailServicePort {
  async sendActivationEmail(
    _payload: ISendActivationEmailPayload,
  ): Promise<void> {
    return;
  }

  async resetPassword(_payload: IResetPasswordPayload): Promise<void> {
    return;
  }
}
