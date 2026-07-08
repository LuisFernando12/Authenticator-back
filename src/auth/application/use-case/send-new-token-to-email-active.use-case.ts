import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/enum/auth-flow.enum';
import { EmailServicePort } from '../port/email-service.port';
import { TokenServicePort } from '../port/token-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';
export interface ISendNewTokenToEmailActiveUseCaseResponse {
  message: string;
}
export class SendNewTokenToEmailActiveUseCase implements BaseUseCase<
  string,
  ISendNewTokenToEmailActiveUseCaseResponse
> {
  constructor(
    private readonly tokenServicePort: TokenServicePort,
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly emailServicePort: EmailServicePort,
  ) {}
  async execute(
    email: string,
  ): Promise<ISendNewTokenToEmailActiveUseCaseResponse> {
    const userDB = await this.userRepositoryPort.findByEmail(email);
    userDB.isVerifiedAccount(AuthFlow.sendNewTokenToEmailActive);

    const token = await this.tokenServicePort.generateEmailVerificationToken({
      sub: userDB.id,
      username: userDB.email,
    });

    await this.emailServicePort.sendActivationEmail({
      email: email,
      name: userDB.name,
      token: token,
    });

    return { message: 'Email sent successfully' };
  }
}
