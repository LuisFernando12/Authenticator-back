import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ConsentEntity } from '../../../../consent/infrastructure/persistence/entity/consent.entity';
import { TokenEntity } from '../../../../token/infrastructure/persistence/entity/token.entity';

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
  @OneToMany(() => TokenEntity, (token) => token.user, { cascade: true })
  @JoinColumn()
  token: TokenEntity;
  @OneToMany(() => ConsentEntity, (userClientConsent) => userClientConsent.user)
  userClientConsent: ConsentEntity[];
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
