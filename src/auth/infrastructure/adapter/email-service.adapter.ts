import { IEmailService } from '../../../service/email.service';
import {
  EmailServicePort,
  IResetPasswordPayload,
  ISendActivationEmailPayload,
} from '../../application/port/email-service.port';
import { AuthDomainError } from '../../domain/error/auth-domain.error';

export class EmailServiceAdapter implements EmailServicePort {
  constructor(private readonly emailService: IEmailService) {}
  async sendActivationEmail(
    payload: ISendActivationEmailPayload,
  ): Promise<void> {
    const { email, name, token } = payload;

    const sendNewEmail = await this.emailService.sendActivationEmail(
      email,
      name,
      token,
    );
    if (sendNewEmail !== 'OK') {
      throw AuthDomainError.internalServerError('Failure to send email');
    }
  }
  async resetPassword(payload: IResetPasswordPayload): Promise<void> {
    const { email, name, code } = payload;
    const emailSend = await this.emailService.resetPassword(email, name, code);

    if (emailSend !== 'OK') {
      throw AuthDomainError.internalServerError(
        'Failure to reset password, try again',
      );
    }
  }
}
