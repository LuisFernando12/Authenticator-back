import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SecurityEventType } from '../../../domain/enum/security-event-type.enum';
import { SeverityType } from '../../../domain/enum/severity-type.enum';

@Entity('security_event')
export class SecurityEventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: SecurityEventType,
    default: SecurityEventType.OTHER,
  })
  type: SecurityEventType;
  @Column()
  ip: string;
  @Column()
  userAgent: string;
  @Column({ nullable: true })
  email?: string;
  @Column({
    type: 'enum',
    enum: SeverityType,
    default: SeverityType.INFORMATIONAL,
  })
  severity: SeverityType;
  @Column({ nullable: true })
  reason?: string;
  @CreateDateColumn({
    name: 'occurred_at',
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurredAt: Date;
}
