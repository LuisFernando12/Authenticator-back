import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ClientEntity } from './client.entity';
import { UserEntity } from './user.entity';

@Entity('user_client_consent')
export class UserClientConsentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  clientId: string;

  @Column({ type: 'text', array: true })
  scopes: Array<string>;

  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: UserEntity;

  @ManyToMany(() => ClientEntity, (client) => client.id, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  clients: ClientEntity;
}
