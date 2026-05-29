import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { ClientRepositoryPort } from '../port/client-repository.port';

export class FindByClientIdUseCase implements BaseUseCase<string> {
  constructor(private readonly clientRepositoryPort: ClientRepositoryPort) {}
  async execute(clientId: string): Promise<any> {
    const clientDB = await this.clientRepositoryPort.findByClientId(clientId);
    clientDB.hiddenClientSecret();
    return clientDB;
  }
}
