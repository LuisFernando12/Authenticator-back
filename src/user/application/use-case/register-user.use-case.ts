import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { User } from '../../domain/entity/user.entity';
import { EmailServicePort } from '../port/email-service.port';
import { EncryptServicePort } from '../port/encrypt-service.port';
import { TokenServicePort } from '../port/token-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';
export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
}
export interface IRegisterUserResponse {
  message: string;
}
export class RegisterUserUseCase implements BaseUseCase<
  IRegisterUserPayload,
  IRegisterUserResponse
> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly encryptServicePort: EncryptServicePort,
    private readonly emailServicePort: EmailServicePort,
    private readonly tokenServicePort: TokenServicePort,
  ) {}
  async execute(payload: IRegisterUserPayload): Promise<{ message: string }> {
    await this.userRepositoryPort.existsUser(payload.email);

    const password = await this.encryptServicePort.encrypt(payload.password);
    const user = new User({ ...payload, password });
    const userDB = await this.userRepositoryPort.create(user);

    const verification_token =
      await this.tokenServicePort.generateEmailVerificationToken({
        sub: userDB.id,
        username: userDB.email,
      });
    const emailResponse = await this.emailServicePort.sendActivationEmail({
      email: userDB.email,
      name: userDB.name,
      token: verification_token as string,
    });

    return {
      message:
        emailResponse === 'OK'
          ? 'User created. Please verify your email to account active!'
          : `User created. Please verify your email to account active, if you have not received the email request it again!`,
    };
  }
}
