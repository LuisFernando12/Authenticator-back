import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserClientConsentEntity } from './user-client-consent.entity';
import { UserEntity } from './user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => UserEntity, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
  @ManyToOne(
    () => UserClientConsentEntity,
    (userClientConsent) => userClientConsent.id,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'consent_id', referencedColumnName: 'id' })
  userClientConsent: UserClientConsentEntity;
  @Column({ name: 'consent_id', nullable: true })
  consentId?: string;
  @Column({ name: 'refresh_token' })
  refreshToken: string;
  @Column('timestamp')
  expiresAt: Date;
}

export interface TokenEntityType {
  user: { id: string };
  refreshToken: string;
  expiresAt: Date;
}
