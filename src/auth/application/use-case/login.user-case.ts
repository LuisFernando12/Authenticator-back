import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/enum/auth-flow.enum';
import { ConfigServicePort } from '../port/config-service.port';
import { TokenServicePort } from '../port/token-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';
import { UserValidateCredentialsServicePort } from '../port/user-validate-credentials-service.port';
export interface ILoginUseCasePayload {
  email: string;
  password: string;
}
export interface ILoginUseCaseResponse {
  access_token: string;
  refresh_token: string;
  expiresAt: string;
  redirect_uri: string;
}
export class LoginUseCase implements BaseUseCase<
  ILoginUseCasePayload,
  ILoginUseCaseResponse
> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly userValidateCredentialsServicePort: UserValidateCredentialsServicePort,
    private readonly tokenServicePort: TokenServicePort,
    private readonly configServicePort: ConfigServicePort,
  ) {}

  async execute(payload: ILoginUseCasePayload): Promise<ILoginUseCaseResponse> {
    const { email, password } = payload;
    const userDB = await this.userRepositoryPort.findByEmail(email);

    const isMatchedPassword =
      await this.userValidateCredentialsServicePort.validate(
        password,
        userDB.password,
      );
    userDB.passwordMismatch(isMatchedPassword);
    userDB.isVerifiedAccount(AuthFlow.login);

    const token = await this.tokenServicePort.generateToken({
      sub: userDB.id,
      username: userDB.email,
    });

    return {
      access_token: token.accessToken,
      refresh_token: token.refreshToken,
      expiresAt: token.expiresAt,
      redirect_uri: this.configServicePort.redirectURI,
    };
  }
}
