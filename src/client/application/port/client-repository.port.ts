import { Client } from '../../domain/entity/client.entity';

export const CLIENT_REPOSITORY_PORT = Symbol('CLIENT_REPOSITORY_PORT');
export abstract class ClientRepositoryPort {
  abstract create(client: Client): Promise<Client>;
  abstract findByClientId(clientId: string): Promise<any>;
}
