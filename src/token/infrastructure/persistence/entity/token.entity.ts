import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ConsentEntity } from '../../../../consent/infrastructure/persistence/entity/consent.entity';
import { UserEntity } from '../../../../user/infrastructure/persistence/entity/user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => UserEntity, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
  @ManyToOne(() => ConsentEntity, (userClientConsent) => userClientConsent.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'consent_id', referencedColumnName: 'id' })
  userClientConsent: ConsentEntity;
  @Column({ name: 'jti', nullable: false, type: 'uuid' })
  jti: string;
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
  jti: string;
  consentId?: string;
}
