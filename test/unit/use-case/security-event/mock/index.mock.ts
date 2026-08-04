import {
  SecurityEvent,
  SecurityEventProps,
} from '@/security-event/domain/entity/security-event.entity';
import { SecurityEventType } from '@/security-event/domain/enum/security-event-type.enum';
import { SeverityType } from '@/security-event/domain/enum/severity-type.enum';
import { SecurityEventLoggerFake } from './security-event-logger-fake';
import { SecurityEventRepositoryFake } from './security-event-repository-fake';

export const securityEventMocked = () => ({
  securityEventRepositoryFake: new SecurityEventRepositoryFake(),
  securityEventLoggerFake: new SecurityEventLoggerFake(),
  mockSecurityEvent: (securityEvent?: Partial<SecurityEventProps>) =>
    new SecurityEvent({
      id: 'test-security-event-id',
      type: SecurityEventType.INVALID_LOGIN_ATTEMPT,
      ip: '127.0.0.1',
      email: 'john.doe@example.com',
      reason: 'Invalid credentials',
      userAgent: 'Jest',
      occurredAt: new Date('2026-08-04T00:00:00.000Z'),
      severity: SeverityType.LOW,
      ...securityEvent,
    }),
});

export type SecurityEventMockedType = ReturnType<typeof securityEventMocked>;
