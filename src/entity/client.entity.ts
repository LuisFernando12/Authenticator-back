import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserClientConsentEntity } from './user-client-consent.entity';

@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
    unique: true,
  })
  clientId: string;
  @Column({ nullable: true, unique: true })
  clientSecret?: string;
  @Column({ nullable: false, default: false })
  isConfidential: boolean;
  @Column({ nullable: false })
  name: string;
  @Column({ type: 'text', array: true, unique: true })
  redirectUris: Array<string>;
  @Column({ type: 'text', array: true })
  grantTypes: Array<string>;
  @Column({ type: 'text', array: true })
  scopes: Array<string>;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @OneToMany(
    () => UserClientConsentEntity,
    (userClientConsent) => userClientConsent.clients,
  )
  userClientConsent: UserClientConsentEntity[];
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
