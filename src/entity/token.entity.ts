import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('token')
export class TokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @OneToOne(() => UserEntity, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
  @Column()
  token: string;
  @Column({ name: 'refresh_token' })
  refreshToken: string;
  @Column('timestamp')
  expiresAt: Date;
}

export interface TokenEntityType {
  user: { id: string };
  refreshToken: string;
  token: string;
  expiresAt: Date;
}
