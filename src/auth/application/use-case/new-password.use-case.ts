import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/entity/auth-user.entity';
import { RedisServicePort } from '../port/redisService.port';
import { UserRepositoryPort } from '../port/user-repository.port';
import { UserValidateCredentialsServicePort } from '../port/user-validate-credentials-service.port';

export class NewPasswordUseCase implements BaseUseCase<{
  password: string;
  code: number;
}> {
  constructor(
    private readonly redisServicePort: RedisServicePort,
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly UserValidateCredentialsServicePort: UserValidateCredentialsServicePort,
  ) {}
  async execute(payload: {
    password: string;
    code: number;
  }): Promise<{ message: string }> {
    const { password, code } = payload;
    const codeRedis =
      await this.redisServicePort.consumeResetPasswordCodeOTP(code);
    const userDB = await this.userRepositoryPort.findByEmail(codeRedis.email);
    userDB.isVerifiedAccount(AuthFlow.newPassword);
    const validatePassword =
      await this.UserValidateCredentialsServicePort.validate(
        password,
        userDB.password,
      );
    userDB.isSamePassword(validatePassword);
    const [_, newPassword] = await Promise.all([
      this.redisServicePort.clearResetPasswordCodeOTP(code),
      this.UserValidateCredentialsServicePort.encrypt(password),
    ]);
    await this.userRepositoryPort.updatePassword(codeRedis.email, newPassword);
    return { message: 'Updated password' };
  }
}
