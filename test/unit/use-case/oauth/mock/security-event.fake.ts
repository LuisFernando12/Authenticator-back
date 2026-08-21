import {
  SecurityEvent,
  SecurityEventPort,
} from '@/oauth/application/port/security-event.port';

export class SecurityEventFake implements SecurityEventPort {
  emit(_event: SecurityEvent): void {
    return;
  }
}
