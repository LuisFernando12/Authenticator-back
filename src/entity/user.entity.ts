import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
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
  @OneToMany(() => TokenEntity, (token) => token.user, { cascade: true }) //One user can have N token
  @JoinColumn()
  token: TokenEntity;
  @OneToMany(
    () => UserClientConsentEntity,
    (userClientConsent) => userClientConsent.user,
  )
  userClientConsent: UserClientConsentEntity[];
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}

export interface UserEntityType {
  name: string;
  email: string;
  password: string;
}
