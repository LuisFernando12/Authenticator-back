import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TokenEntity } from './token.entity';
import { UserClientConsentEntity } from './user-client-consent.entity';

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
  @OneToMany(
    () => UserClientConsentEntity,
    (userClientConsent) => userClientConsent.users,
  )
  userClientConsent: UserClientConsentEntity[];
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
