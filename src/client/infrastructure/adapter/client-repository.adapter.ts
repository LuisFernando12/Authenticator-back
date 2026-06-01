import { ClientRepositoryPort } from '@/client/application/port/client-repository.port';
import { Client } from '@/client/domain/entity/client.entity';
import { IClientRepository } from '@/repository/client.repository';
import { ClientDomainError } from '../../domain/error/client-domain.error';

export class ClientRepositoryAdapter implements ClientRepositoryPort {
  constructor(private readonly clientRepository: IClientRepository) {}
  async create(client: Client): Promise<Client> {
    try {
      const clientDB = await this.clientRepository.create({
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        isConfidential: client.isConfidential,
        name: client.name,
        redirectUris: client.redirectUris,
        grantTypes: client.grantTypes,
        scopes: client.scopes,
        isActive: client.isActive,
      });
      return new Client(clientDB);
    } catch (error: any) {
      if (error.status && error.status === 409) {
        throw ClientDomainError.conflict('Client already exists');
      }
      throw ClientDomainError.internalServerError('Failure to create client');
    }
  }
  async findByClientId(clientId: string): Promise<Client> {
    if (!clientId) {
      throw ClientDomainError.invalidRequest();
    }
    const clientDB = await this.clientRepository.findByClientId(clientId);
    if (!clientDB) {
      throw ClientDomainError.invalidClient('Client not found');
    }
    return new Client(clientDB);
  }
}
