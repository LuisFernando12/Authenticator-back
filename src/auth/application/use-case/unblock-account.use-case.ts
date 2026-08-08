import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { EmailServicePort } from '../port/email-service.port';
import { RedisServicePort } from '../port/redis-service.port';
import { TempPasswordServicePort } from '../port/temp-password.port';
import { UserRepositoryPort } from '../port/user-repository.port';
export interface IUnblockAccountPayload {
  code: number;
}
export class UnblockAccountUseCase implements BaseUseCase<
  IUnblockAccountPayload,
  void
> {
  constructor(
    private readonly redisServicePort: RedisServicePort,
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly emailServicePort: EmailServicePort,
    private readonly tempPasswordServicePort: TempPasswordServicePort,
  ) {}
  async execute({ code }: IUnblockAccountPayload): Promise<void> {
    const { email } =
      await this.redisServicePort.consumeUnblockAccountCodeOTP(code);
    await this.userRepositoryPort.unblockAccount(email);

    const { name } = await this.userRepositoryPort.findByEmail(email);
    const tempPassword = this.tempPasswordServicePort.password();
    await this.userRepositoryPort.updatePassword(
      email,
      await this.tempPasswordServicePort.hashPassword(tempPassword),
    );

    await Promise.all([
      this.emailServicePort.unblockAccount({
        email,
        username: name,
        tempPassword,
      }),
      this.redisServicePort.clearUnblockAccountCodeOTP(code),
      this.redisServicePort.clearFailedLoginAttempt(email),
    ]);
  }
}
