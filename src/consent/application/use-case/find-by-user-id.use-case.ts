import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Consent } from '../../domain/entity/consent.entity';
import { ConsentRepositoryPort } from '../port/consent-repository.port';

export class FindByUserIdUseCase implements BaseUseCase<string> {
  constructor(private readonly consentRespositoryPort: ConsentRepositoryPort) {}
  async execute(userId: string): Promise<Consent[]> {
    return await this.consentRespositoryPort.findByUserId(userId);
  }
}
