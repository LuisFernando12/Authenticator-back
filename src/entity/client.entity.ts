import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('client')
export class ClientEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    nullable: false,
    unique: true,
  })
  clientId: string;
  @Column({ nullable: true })
  clientSecret?: string;
  @Column({ nullable: false })
  name: string;
  @Column({ type: 'text', array: true })
  redirectUris: Array<string>;
  @Column({ type: 'text', array: true })
  grantTypes: Array<string>;
  @Column({ type: 'text', array: true })
  scopes: Array<string>;
  @Column({ type: 'boolean', default: true })
  isActive: boolean;
  @Column('timestamp with time zone', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
