import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from '../../../../client/infrastructure/persistence/entity/client.entity';
import { SessionEntity } from '../../../../session/infrastructure/persistence/entity/session.entity';
import { TokenEntity } from '../../../../token/infrastructure/persistence/entity/token.entity';
import { UserEntity } from '../../../../user/infrastructure/persistence/entity/user.entity';

@Entity('consent')
export class ConsentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', array: true })
  scopes: Array<string>;

  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'client_id', nullable: false })
  clientId: string;

  @ManyToOne(() => UserEntity, (user) => user.userClientConsent, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @ManyToOne(() => ClientEntity, (client) => client.userClientConsent, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'clientId',
  })
  client: ClientEntity;

  @OneToMany(() => TokenEntity, (token) => token.consent)
  tokens: TokenEntity[];

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  grantedAt: Date;

  @Column({ name: 'expires_at', nullable: true, default: null })
  expiresAt: Date | null;

  @Column({ name: 'revoke_at', nullable: true, default: null })
  revokeAt: Date | null;
  @OneToMany(() => SessionEntity, (session) => session.consent)
  sessions: SessionEntity[];
}
