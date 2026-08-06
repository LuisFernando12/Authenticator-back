import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Email } from '../../domain/entity/email.entity';
import { EmailDomainError } from '../../domain/error/email-domain.error';
import { ConfigServicePort } from '../port/config-service.port';
import { EmailLoggerPort } from '../port/email-logger.port';
import { MailerServicePort } from '../port/mailer-service.port';

export class SendBlockAccountEmailUseCase implements BaseUseCase<Email, void> {
  constructor(
    private readonly mailerServicePort: MailerServicePort,
    private readonly configEnv: ConfigServicePort,
    private readonly emailLoggerPort: EmailLoggerPort,
  ) {}
  async execute(payload: Email): Promise<void> {
    this.emailLoggerPort.log('Start SendResetPasswordEmailUseCase', {});
    try {
      await this.mailerServicePort.sendMail({
        to: payload.email,
        subject: 'Bloqueio de conta',
        template: './blockAccount',
        context: {
          username: payload.username,
          unblockAccountURL: `${this.configEnv.serviceUnblockAccountUrl}`,
          code: String(payload.code),
        },
      });
      this.emailLoggerPort.log('Success email sent', {});
    } catch (error) {
      this.emailLoggerPort.error('Error to send email', {
        errorStack: { cause: error },
      });
      throw EmailDomainError.internalServerError(
        'Failure to send reset password email',
      );
    }
  }
}
