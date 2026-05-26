import { OauthClient } from '../../domain/entity/oauth-client.entity';

export const CLIENT_SERVICE_PORT = Symbol('CLIENT_SERVICE_PORT');
export abstract class ClientServicePort {
  abstract findByClientId(clientId: string): Promise<OauthClient | null>;
}
