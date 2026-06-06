import { ClientEntity } from '@/client/infrastructure/persistence/entity/client.entity';
import { UserResponseDTO } from '../dto/user.dto';
type User = Omit<UserResponseDTO, 'userClientConsent' | 'password'>;
type Client = Omit<ClientEntity, 'userClientConsent'>;
export interface IConsentResponse {
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
