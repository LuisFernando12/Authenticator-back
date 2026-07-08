import { EmailService } from '../../../core/application/service/email.service';
import {
  EmailServicePort,
  ISendActivationEmailPayload,
} from '../../application/port/email-service.port';
import { UserDomainError } from '../../domain/error/user-domain.error';

export class EmailServiceAdapter implements EmailServicePort {
  constructor(private readonly emailService: EmailService) {}
  async sendActivationEmail(
    emailPayload: ISendActivationEmailPayload,
  ): Promise<string> {
    try {
      const emailResponse = await this.emailService.sendActivationEmail(
        emailPayload.email,
        emailPayload.name,
        emailPayload.token,
      );
      return emailResponse;
    } catch {
      throw UserDomainError.internalServerError('Failure to send email');
    }
  }
}
