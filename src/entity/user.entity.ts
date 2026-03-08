import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClientEntity } from './client.entity';
import { TokenEntity } from './token.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: false })
  isVerified: boolean;
  @OneToOne(() => TokenEntity, (token) => token.user, { cascade: true })
  @JoinColumn()
  token: TokenEntity;
  @ManyToMany(() => ClientEntity, (client) => client.id, { cascade: true })
  @JoinTable({
    name: 'user_client',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'client_id' },
  })
  clients: ClientEntity[];
  @Column('time with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}

export interface UserEntityType {
  name: string;
  email: string;
  password: string;
}
