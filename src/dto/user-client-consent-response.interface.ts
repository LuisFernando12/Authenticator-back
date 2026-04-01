import { ClientEntity } from '../entity/client.entity';
import { UserResponseDTO } from './user.dto';
type User = Omit<UserResponseDTO, 'userClientConsent' | 'password'>;
type Client = Omit<ClientEntity, 'userClientConsent'>;
/**
   id: string;
   scopes: Array<string>;
   userId: string;
   clientId: string;
   user: UserEntity;
   client: ClientEntity;
   tokens: TokenEntity[];
   grantedAt: Date;
   expiresAt: Date | null;
   revokeAt: Date | null;
 */
export interface IUserClientConsentResponse {
  id: string;
  scopes: Array<string>;
  userId: string;
  clientId: string;
  user: Array<User> | User;
  client: Array<Client> | Client;
  grantedAt: Date;
  expiresAt: Date | null;
  revokeAt: Date | null;
}
export interface IUserClientConsentResponseWithoutRelations {
  id: string;
  userId: string;
  clientId: string;
  scopes: Array<string>;
  grantedAt: Date;
  expiresAt?: Date | null;
  revokeAt?: Date | null;
}
