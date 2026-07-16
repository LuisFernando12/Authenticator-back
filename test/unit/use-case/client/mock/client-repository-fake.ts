import { ClientRepositoryPort } from '@/client/application/port/client-repository.port';
import { Client } from '@/client/domain/entity/client.entity';

export class ClientRepositoryFake implements ClientRepositoryPort {
  async create(client: Client): Promise<Client> {
    return Promise.resolve(client);
  }

  async findByClientId(clientId: string): Promise<Client> {
    return Promise.resolve(
      new Client({
        name: 'Test Client',
        clientId,
        clientSecret: 'hashed-client-secret',
        isConfidential: true,
        redirectUris: ['http://localhost:4000/callback'],
        grantTypes: ['authorization_code'],
        scopes: ['email', 'phone'],
        isActive: true,
      }),
    );
  }
}
