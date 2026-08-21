import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Email } from '../../domain/entity/email.entity';
import { EmailDomainError } from '../../domain/error/email-domain.error';
import { EmailLoggerPort } from '../port/email-logger.port';
import { MailerServicePort } from '../port/mailer-service.port';

export class SendUnblockAccountEmailUseCase implements BaseUseCase<
  Email,
  void
> {
  constructor(
    private readonly mailerServicePort: MailerServicePort,
    private readonly emailLoggerPort: EmailLoggerPort,
  ) {}
  async execute(payload: Email): Promise<void> {
    this.emailLoggerPort.log('Start SendUnblockAccountEmailUseCase', {});
    try {
      await this.mailerServicePort.sendMail({
        to: payload.email,
        subject: 'Conta Desbloqueada',
        template: './unblockAccount',
        context: {
          username: payload.username,
          tempPassword: payload.tempPassword,
        },
      });
    } catch (error) {
      this.emailLoggerPort.error('Error to send email', {
        errorStack: { cause: error },
      });
      throw EmailDomainError.internalServerError(
        'Failure to send unblock account email',
      );
    }
  }
}
