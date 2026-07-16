import { GenerateClientsServicePort } from '@/client/application/port/generate-clients-service.port';

export class GenerateClientsServiceFake implements GenerateClientsServicePort {
  generateClientId(_name: string): string {
    return 'test-client-id';
  }

  async generateClientSecret(_pepper: string): Promise<{
    clientSecretPlainText: string;
    clientSecretHashed: string;
  }> {
    return Promise.resolve({
      clientSecretPlainText: 'plain-client-secret',
      clientSecretHashed: 'hashed-client-secret',
    });
  }
}
