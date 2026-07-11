import { Email } from '../../domain/entity/email.entity';
import { SendActivationAccountEmailUseCase } from '../use-cases/send-activation-account-email.use-case';
import { SendResetPasswordEmailUseCase } from '../use-cases/send-reset-password-email';

export abstract class EmailService {
  abstract sendActivationAccountEmail(email: Email): Promise<void>;
  abstract sendResetPasswordEmail(email: Email): Promise<void>;
}
export class EmailServiceImpls implements EmailService {
  constructor(
    private readonly sendActivationAccountEmailUseCase: SendActivationAccountEmailUseCase,
    private readonly sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase,
  ) {}
  async sendActivationAccountEmail(email: Email): Promise<void> {
    return await this.sendActivationAccountEmailUseCase.execute(email);
  }
  async sendResetPasswordEmail(email: Email): Promise<void> {
    return await this.sendResetPasswordEmailUseCase.execute(email);
  }
}
