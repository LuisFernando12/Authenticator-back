import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SecurityEvent,
  SecurityEventPort,
} from '../../application/port/security-event.port';
import { AuthDomainError } from '../../domain/error/auth-domain.error';

export class SecurityEventAdapter implements SecurityEventPort {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit(event: SecurityEvent): void {
    try {
      this.eventEmitter.emit('security-event.suspicious', event);
    } catch {
      throw AuthDomainError.internalServerError('Error to emit security event');
    }
  }
}
