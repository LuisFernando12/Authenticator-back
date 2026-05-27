import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/entity/auth-user.entity';
import { TokenServicePort } from '../port/token-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';

export class ActiveAccountUseCase implements BaseUseCase<string> {
  constructor(
    private readonly tokenServicePort: TokenServicePort,
    private readonly userRepositoryPort: UserRepositoryPort,
  ) {}
  async execute(token: string): Promise<{ message: string }> {
    const {
      verifyTokenProps: { username },
    } = await this.tokenServicePort.verifyToken(token);
    const userDB = await this.userRepositoryPort.findByEmail(username);
    userDB.isVerifiedAccount(AuthFlow.activeAccount);
    await this.userRepositoryPort.activeAccount(username);

    return { message: 'Account activated successfully' };
  }
}
