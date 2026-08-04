import { CreateSecurityEventUseCase } from '../../application/use-cases/create-security-event.use-case';
import { SecurityEvent } from '../../domain/entity/security-event.entity';
import { SecurityDomainError } from '../../domain/error/security-domain.error';

export abstract class SecurityEventService {
  abstract create(payload: SecurityEvent): Promise<void>;
}
export class SecurityEventServiceImpl implements SecurityEventService {
  constructor(
    private readonly createSecurityEventUseCase: CreateSecurityEventUseCase,
  ) {}
  async create(payload: SecurityEvent): Promise<void> {
    const securityEvent =
      await this.createSecurityEventUseCase.execute(payload);
    if (!securityEvent) {
      throw SecurityDomainError.internalServerError(
        'Error to create security event',
      );
    }
  }
}
