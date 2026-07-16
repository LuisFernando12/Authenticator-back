import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Consent } from '../../domain/entity/consent.entity';
import { ConsentRepositoryPort } from '../port/consent-repository.port';

export class CreateConsentUseCase implements BaseUseCase<Consent, void> {
  constructor(private readonly consentRepositoryPort: ConsentRepositoryPort) {}
  async execute(payload: Consent): Promise<void> {
    return await this.consentRepositoryPort.create(payload);
  }
}
