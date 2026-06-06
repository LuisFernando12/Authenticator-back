import { IClientRepository } from '../../../client/infrastructure/repository/client.repository';
import { ClientServicePort } from '../../application/port/client-service.port';
import { OauthClient } from '../../domain/entity/oauth-client.entity';

export abstract class IClientService {
  abstract create(): Promise<OauthClient>;
  abstract findByClientId(clientId: string): Promise<OauthClient | null>;
}
export class ClientServiceAdapter implements ClientServicePort {
  constructor(private readonly clientRepository: IClientRepository) {}
  async findByClientId(clientId: string) {
    const clientDB = await this.clientRepository.findByClientId(clientId);
    if (!clientDB) {
      throw new Error('ClientID not found');
    }
    return new OauthClient(clientDB);
  }
}
