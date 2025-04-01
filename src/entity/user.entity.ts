import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
}

export interface UserEntityType {
  name: string;
  email: string;
  password: string;
}
