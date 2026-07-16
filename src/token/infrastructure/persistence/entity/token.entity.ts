import {
  Column,
  DeleteDateColumn,
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
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
  @ManyToOne(() => ConsentEntity, (consent) => consent.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'consent_id', referencedColumnName: 'id' })
  consent: ConsentEntity;
  @Column({
    name: 'token_family_id',
    nullable: false,
    type: 'uuid',
  })
  tokenFamilyId: string;
  @Column({ name: 'jti', nullable: false, type: 'uuid', unique: true })
  jti: string;
  @Column({ name: 'user_id', nullable: false })
  userId: string;
  @Column({ name: 'consent_id', nullable: true })
  consentId?: string;
  @Column({ name: 'refresh_token' })
  refreshToken: string;
  @Column({
    name: 'expires_at',
    nullable: false,
    type: 'timestamp with time zone',
  })
  expiresAt: Date;
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt?: Date;
}

export interface TokenEntityType {
  user: { id: string };
  refreshToken: string;
  expiresAt: Date;
  jti: string;
  consentId?: string;
}
