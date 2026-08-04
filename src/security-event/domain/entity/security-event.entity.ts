import { SecurityEventType } from '../enum/security-event-type.enum';
import { SeverityType } from '../enum/severity-type.enum';
export interface SecurityEventProps {
  id: string;
  type: SecurityEventType;
  ip: string;
  email?: string;
  userAgent: string;
  occurredAt: Date;
  severity: SeverityType;
}
export class SecurityEvent {
  constructor(private readonly securityEventProps: SecurityEventProps) {}
  get id(): string {
    return this.securityEventProps.id;
  }
  get type(): SecurityEventType {
    return this.securityEventProps.type;
  }
  get ip(): string {
    return this.securityEventProps.ip;
  }
  get email(): string {
    return this.securityEventProps.email;
  }
  get userAgent(): string {
    return this.securityEventProps.userAgent;
  }
  get occurredAt(): Date {
    return this.securityEventProps.occurredAt;
  }
  get severity(): SeverityType {
    return this.securityEventProps.severity;
  }
}
