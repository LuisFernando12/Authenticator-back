import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Email } from '../../domain/entity/email.entity';
import { ConfigServicePort } from '../port/config-service.port';
import { MailerServicePort } from '../port/mailer-service.port';

export class SendActivationAccountEmailUseCase implements BaseUseCase<
  Email,
  void
> {
  constructor(
    private readonly mailerServicePort: MailerServicePort,
    private readonly configEnv: ConfigServicePort,
  ) {}
  async execute(payload: Email): Promise<void> {
    await this.mailerServicePort.sendMail({
      to: payload.email,
      subject: 'Email de ativação',
      template: './activeAccount',
      context: {
        username: payload.username,
        activeUrl: `${this.configEnv.serviceVerifyEmailURL}/?token=${payload.token}`,
      },
    });
  }
}
