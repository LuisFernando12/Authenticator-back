import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Client } from '../../domain/entity/client.entity';
import { ClientRepositoryPort } from '../port/client-repository.port';

export class FindByClientIdUseCase implements BaseUseCase<string, Client> {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}
  async execute(clientId: string): Promise<Client> {
    const clientDB = await this.clientRepositoryPort.findByClientId(clientId);
    clientDB.hiddenClientSecret();
    return clientDB;
  }
}
