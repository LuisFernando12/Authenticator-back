import {
  SecurityEvent,
  SecurityEventPort,
} from '@/auth/application/port/security-event.port';

export class SecurityEventFake implements SecurityEventPort {
  emit(_event: SecurityEvent): void {
    return;
  }
}
