import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Email } from '../../domain/entity/email.entity';
import { ConfigServicePort } from '../port/config-service.port';
import { MailerServicePort } from '../port/mailer-service.port';

export class SendResetPasswordEmailUseCase implements BaseUseCase<Email, void> {
  constructor(
    private readonly mailerServicePort: MailerServicePort,
    private readonly configEnv: ConfigServicePort,
  ) {}
  async execute(payload: Email): Promise<void> {
    await this.mailerServicePort.sendMail({
      to: payload.email,
      subject: 'Recuperação de senha',
      template: './resetPassword',
      context: {
        username: payload.username,
        resetPasswordURL: `${this.configEnv.serviceResetPasswordUrl}`,
        code: String(payload.code),
      },
    });
  }
}
