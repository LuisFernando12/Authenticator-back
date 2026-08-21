import { SecurityEventRepositoryPort } from '../../application/port/security-event-repository.port';
import { SecurityEvent } from '../../domain/entity/security-event.entity';
import { SecurityDomainError } from '../../domain/error/security-domain.error';
import { SecurityEventRepository } from '../persistence/repository/security-event.repository';

export class SecurityEventRepositoryAdapter implements SecurityEventRepositoryPort {
  constructor(
    private readonly securityEventRepository: SecurityEventRepository,
  ) {}
  async create(event: SecurityEvent): Promise<SecurityEvent> {
    try {
      const securityEvent = await this.securityEventRepository.create(event);
      return new SecurityEvent(securityEvent);
    } catch {
      throw SecurityDomainError.internalServerError(
        'Error to create security event',
      );
    }
  }
  async findAll(): Promise<SecurityEvent[]> {
    const securityEvents = await this.securityEventRepository.findAll();
    return securityEvents.map(
      (securityEvent) => new SecurityEvent(securityEvent),
    );
  }
}
