import { ClientEntity } from '../entity/client.entity';
import { UserResponseDTO } from './user.dto';
type User = Omit<UserResponseDTO, 'userClientConsent' | 'password'>;
type Client = Omit<ClientEntity, 'userClientConsent'>;
export class UserClientConsentResponseDTO {
  users: Array<User> | User;
  clients: Array<Client> | Client;
  scopes: Array<string>;
}
