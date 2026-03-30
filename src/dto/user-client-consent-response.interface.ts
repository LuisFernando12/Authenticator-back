import { ClientEntity } from '../entity/client.entity';
import { UserResponseDTO } from './user.dto';
type User = Omit<UserResponseDTO, 'userClientConsent' | 'password'>;
type Client = Omit<ClientEntity, 'userClientConsent'>;
export interface IUserClientConsentResponse {
  id: string;
  users: Array<User> | User;
  clients: Array<Client> | Client;
  scopes: Array<string>;
}
export interface IUserClientConsentResponseWithoutRelations {
  id: string;
  userId: string;
  clientId: string;
  scopes: Array<string>;
}
