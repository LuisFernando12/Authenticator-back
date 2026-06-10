import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Token } from '../../domain/entity/token.entity';
import { TokenRepositoryPort } from '../port/token-repository.port';

export class FindByRefreshTokenUseCase implements BaseUseCase<string> {
  constructor(private readonly tokenRepositoryPort: TokenRepositoryPort) {}
  async execute(token: string): Promise<Token> {
    return await this.tokenRepositoryPort.findByRefreshToken(token);
  }
}
