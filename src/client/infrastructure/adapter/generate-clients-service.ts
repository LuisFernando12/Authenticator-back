import { hash } from 'bcrypt';
import { randomBytes, randomUUID } from 'node:crypto';
import { GenerateClientsServicePort } from '../../application/port/generate-clients-service.port';
export class GenerateClientsServiceAdapter implements GenerateClientsServicePort {
  generateClientId(name: string): string {
    return name.split(' ')[0] + '-' + randomUUID();
  }
  async generateClientSecret(pepper: string): Promise<{
    clientSecretPlainText: string;
    clientSecretHashed: string;
  }> {
    const clientSecret = randomBytes(64).toString('hex');
    return {
      clientSecretPlainText: clientSecret,
      clientSecretHashed: await hash(clientSecret + pepper, 10),
    };
  }
}
