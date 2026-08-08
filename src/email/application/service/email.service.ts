import { Email } from '../../domain/entity/email.entity';
import { SendActivationAccountEmailUseCase } from '../use-cases/send-activation-account-email.use-case';
import { SendBlockAccountEmailUseCase } from '../use-cases/send-block-account-email.use-case';
import { SendResetPasswordEmailUseCase } from '../use-cases/send-reset-password-email';
import { SendUnblockAccountEmailUseCase } from '../use-cases/send-unblock-account-email.use-case';

export abstract class EmailService {
  abstract sendActivationAccountEmail(email: Email): Promise<void>;
  abstract sendResetPasswordEmail(email: Email): Promise<void>;
  abstract sendBlockAccountEmail(email: Email): Promise<void>;
  abstract sendUnblockAccountEmail(email: Email): Promise<void>;
}
export class EmailServiceImpls implements EmailService {
  constructor(
    private readonly sendActivationAccountEmailUseCase: SendActivationAccountEmailUseCase,
    private readonly sendResetPasswordEmailUseCase: SendResetPasswordEmailUseCase,
    private readonly sendBlockAccountEmailUseCase: SendBlockAccountEmailUseCase,
    private readonly sendUnblockAccountEmailUseCase: SendUnblockAccountEmailUseCase,
  ) {}
  async sendActivationAccountEmail(email: Email): Promise<void> {
    return await this.sendActivationAccountEmailUseCase.execute(email);
  }
  async sendResetPasswordEmail(email: Email): Promise<void> {
    return await this.sendResetPasswordEmailUseCase.execute(email);
  }
  async sendBlockAccountEmail(email: Email): Promise<void> {
    return await this.sendBlockAccountEmailUseCase.execute(email);
  }
  async sendUnblockAccountEmail(email: Email): Promise<void> {
    return await this.sendUnblockAccountEmailUseCase.execute(email);
  }
}
