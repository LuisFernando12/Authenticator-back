import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/entity/auth-user.entity';
import { ConfigServicePort } from '../port/config-service.port';
import { TokenServicePort } from '../port/token-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';
import { UserValidateCredentialsServicePort } from '../port/user-validate-credentials-service.port';
export interface IPayloadLoginUseCase {
  email: string;
  password: string;
}
export class LoginUseCase implements BaseUseCase<IPayloadLoginUseCase> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly userValidateCretentialsServicePort: UserValidateCredentialsServicePort,
    private readonly tokenServicePort: TokenServicePort,
    private readonly configServicePort: ConfigServicePort,
  ) {}

  async execute(payload: IPayloadLoginUseCase): Promise<any> {
    const { email, password } = payload;
    const userDB = await this.userRepositoryPort.findByEmail(email);

    const isMatchedPassword =
      await this.userValidateCretentialsServicePort.validate(
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
      ...token['tokenProps'],
      redirect_uri: this.configServicePort.redirectURI,
    };
  }
}
