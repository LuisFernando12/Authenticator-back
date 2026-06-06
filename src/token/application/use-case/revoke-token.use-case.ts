import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { TokenRepositoryPort } from '../port/token-repository.port';

export class RevokeTokenUseCase implements BaseUseCase<string> {
  constructor(private readonly tokenRepositoryPort: TokenRepositoryPort) {}
  async execute(token: string): Promise<{ message: string }> {
    await this.tokenRepositoryPort.deleteToken(token);
    return { message: 'Token revoked' };
  }
}
