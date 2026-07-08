import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Consent } from '../../domain/entity/consent.entity';
import { ConsentRepositoryPort } from '../port/consent-repository.port';

export class FindByUserIdUseCase implements BaseUseCase<string, Consent[]> {
  constructor(private readonly consentRepositoryPort: ConsentRepositoryPort) {}
  async execute(userId: string): Promise<Consent[]> {
    return await this.consentRepositoryPort.findByUserId(userId);
  }
}
