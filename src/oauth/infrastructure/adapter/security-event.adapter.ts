import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SecurityEvent,
  SecurityEventPort,
} from '../../application/port/security-event.port';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class SecurityEventAdapter implements SecurityEventPort {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  emit(event: SecurityEvent): void {
    try {
      this.eventEmitter.emit('security-event.suspicious', event);
    } catch {
      throw OauthDomainError.internalServerError(
        'Error to emit security event',
      );
    }
  }
}
