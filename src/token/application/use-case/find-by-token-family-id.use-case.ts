import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Token } from '../../domain/entity/token.entity';
import { TokenRepositoryPort } from '../port/token-repository.port';

export class FindByTokenFamilyIdUseCase implements BaseUseCase<
  string,
  Token[]
> {
  constructor(private readonly tokenRepositoryPort: TokenRepositoryPort) {}
  async execute(tokenFamilyId: string): Promise<Token[]> {
    return await this.tokenRepositoryPort.findByTokenFamilyId(tokenFamilyId);
  }
}
