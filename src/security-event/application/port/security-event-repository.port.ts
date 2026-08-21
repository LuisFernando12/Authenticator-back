import { SecurityEvent } from '../../domain/entity/security-event.entity';

export const SECURITY_EVENT_REPOSITORY_PORT = Symbol(
  'SECURITY_EVENT_REPOSITORY_PORT',
);

export abstract class SecurityEventRepositoryPort {
  abstract create(event: SecurityEvent): Promise<SecurityEvent>;
  abstract findAll(): Promise<SecurityEvent[]>;
}
