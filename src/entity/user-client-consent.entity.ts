import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from './client.entity';
import { UserEntity } from './user.entity';

@Entity('user_client_consent')
export class UserClientConsentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  clientId: string;

  @Column({ type: 'text', array: true })
  scopes: Array<string>;

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  users: UserEntity;

  @ManyToOne(() => ClientEntity, (client) => client.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'client_id',
    referencedColumnName: 'clientId',
  })
  clients: ClientEntity;
}
