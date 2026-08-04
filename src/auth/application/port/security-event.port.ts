import { SecurityEventType } from '@/security-event/domain/enum/security-event-type.enum';
import { SeverityType } from '@/security-event/domain/enum/severity-type.enum';
interface SecurityEvent {
  type: SecurityEventType;
  ip: string;
  email?: string;
  userAgent: string;
  severity: SeverityType;
}
export const SECURITY_EVENT_PORT = Symbol('SECURITY_EVENT_PORT');
export abstract class SecurityEventPort {
  abstract emit(event: SecurityEvent): void;
}
