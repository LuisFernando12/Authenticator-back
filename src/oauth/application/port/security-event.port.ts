import { SecurityEventType } from '../../../security-event/domain/enum/security-event-type.enum';
import { SeverityType } from '../../../security-event/domain/enum/severity-type.enum';

export const SECURITY_EVENT_PORT = Symbol('SECURITY_EVENT_PORT');

export type InvalidLoginAttemptReasonType =
  | 'USER_NOT_FOUND'
  | 'INVALID_PASSWORD';
export interface SecurityEvent {
  type: SecurityEventType;
  ip: string;
  email?: string;
  userAgent: string;
  severity: SeverityType;
  reason?: InvalidLoginAttemptReasonType;
}
export abstract class SecurityEventPort {
  abstract emit(event: SecurityEvent): void;
}
