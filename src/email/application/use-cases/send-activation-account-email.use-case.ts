import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Email } from '../../domain/entity/email.entity';
import { EmailDomainError } from '../../domain/error/email-domain.error';
import { ConfigServicePort } from '../port/config-service.port';
import { EmailLoggerPort } from '../port/email-logger.port';
import { MailerServicePort } from '../port/mailer-service.port';
export class SendActivationAccountEmailUseCase implements BaseUseCase<
  Email,
  void
> {
  constructor(
    private readonly mailerServicePort: MailerServicePort,
    private readonly configEnv: ConfigServicePort,
    private readonly emailLoggerPort: EmailLoggerPort,
  ) {}
  async execute(payload: Email): Promise<void> {
    this.emailLoggerPort.log('SendActivationAccountEmailUseCase', {});
    try {
      await this.mailerServicePort.sendMail({
        to: payload.email,
        subject: 'Email de ativação',
        template: './activeAccount',
        context: {
          username: payload.username,
          activeUrl: `${this.configEnv.serviceVerifyEmailURL}/?token=${payload.token}`,
        },
      });
      this.emailLoggerPort.log('Success email sent', {});
    } catch (error) {
      this.emailLoggerPort.error('Error to send email', {
        errorStack: { cause: error },
      });
      throw EmailDomainError.internalServerError('Failure to send email');
    }
  }
}
