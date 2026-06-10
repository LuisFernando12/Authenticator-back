import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Consent } from '../../domain/entity/consent.entity';
import { ConsentRepositoryPort } from '../port/consent-repository.port';

export class FindByUserIdAndClientIdUseCase implements BaseUseCase<{
  userId: string;
  clientId: string;
}> {
  constructor(private readonly consentRepositoryPort: ConsentRepositoryPort) {}
  async execute(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent> {
    return await this.consentRepositoryPort.findByUserIdAndClientId({
      userId: payload.userId,
      clientId: payload.clientId,
    });
  }
}
