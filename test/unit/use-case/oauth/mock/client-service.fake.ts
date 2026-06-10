import { ClientServicePort } from '../../../../../src/oauth/application/port/client-service.port';
import { OauthClient } from '../../../../../src/oauth/domain/entity/oauth-client.entity';

export class ClientServiceFake implements ClientServicePort {
  findByClientId(clientId: string): Promise<OauthClient | null> {
    const client = new OauthClient({
      clientId: clientId,
      clientSecret: 'test-client-secret',
      isConfidential: true,
      name: 'Test Client',
      redirectUris: ['https://example.com/callback'],
      scopes: ['read', 'write'],
      isActive: true,
    });
    return Promise.resolve(client);
  }
}
