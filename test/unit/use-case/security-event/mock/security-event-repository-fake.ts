import { SecurityEventRepositoryPort } from '@/security-event/application/port/security-event-repository.port';
import { SecurityEvent } from '@/security-event/domain/entity/security-event.entity';

export class SecurityEventRepositoryFake implements SecurityEventRepositoryPort {
  async create(event: SecurityEvent): Promise<SecurityEvent> {
    return event;
  }

  async findAll(): Promise<SecurityEvent[]> {
    return [];
  }
}
