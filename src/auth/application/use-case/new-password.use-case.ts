import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/enum/auth-flow.enum';
import { RedisServicePort } from '../port/redis-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';
import { UserValidateCredentialsServicePort } from '../port/user-validate-credentials-service.port';
export interface INewPasswordUseCasePayload {
  password: string;
  code: number;
}
export interface INewPasswordUseCaseResponse {
  message: string;
}
export class NewPasswordUseCase implements BaseUseCase<
  INewPasswordUseCasePayload,
  INewPasswordUseCaseResponse
> {
  constructor(
    private readonly redisServicePort: RedisServicePort,
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly userValidateCredentialsServicePort: UserValidateCredentialsServicePort,
  ) {}
  async execute(
    payload: INewPasswordUseCasePayload,
  ): Promise<INewPasswordUseCaseResponse> {
    const { password, code } = payload;
    const codeRedis =
      await this.redisServicePort.consumeResetPasswordCodeOTP(code);
    const userDB = await this.userRepositoryPort.findByEmail(codeRedis.email);
    userDB.isVerifiedAccount(AuthFlow.newPassword);
    const validatePassword =
      await this.userValidateCredentialsServicePort.validate(
        password,
        userDB.password,
      );
    userDB.isSamePassword(validatePassword);
    const hashedPassword =
      await this.userValidateCredentialsServicePort.encrypt(password);
    await Promise.all([
      this.userRepositoryPort.updatePassword(codeRedis.email, hashedPassword),
      this.redisServicePort.clearResetPasswordCodeOTP(code),
    ]);
    return { message: 'Updated password' };
  }
}
