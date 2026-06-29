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

@Entity({ name: 'sessions' })
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  jti: string;
  @Column({ name: 'user_id', nullable: false })
  userId: string;
  @Column({ name: 'consent_id', nullable: true })
  consentId: string;
  @Column({ name: 'token_family_id', nullable: false })
  tokenFamilyId: string;
  @Column({ name: 'expires_at', nullable: false })
  expiresAt: Date;
  @Column({
    name: 'created_at',
    nullable: true,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    type: 'timestamp with time zone',
  })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
  @ManyToOne(() => ConsentEntity, (consent) => consent.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'consent_id', referencedColumnName: 'id' })
  consent: ConsentEntity;
}
export type SessionEntityType = Omit<
  SessionEntity,
  'user' | 'consent' | 'id' | 'createdAt' | 'updatedAt'
>;
