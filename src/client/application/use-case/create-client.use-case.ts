import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Client } from '../../domain/entity/client.entity';
import { ClientRepositoryPort } from '../port/client-repository.port';
import { ConfigServicePort } from '../port/config-service.port';
import { GenerateClientsServicePort } from '../port/generate-clients-service.port';

export interface IPayloadCreateClient {
  name: string;
  redirectUris: Array<string>;
  grantTypes: Array<string>;
  scopes: Array<string>;
  isConfidential: boolean;
}
export class CreateClientUseCase implements BaseUseCase<IPayloadCreateClient> {
  constructor(
    private readonly clientRepositoryPort: ClientRepositoryPort,
    private readonly generateClientsServicePort: GenerateClientsServicePort,
    private configService: ConfigServicePort,
  ) {}
  async execute(clientPayload: IPayloadCreateClient): Promise<Client> {
    const clientId = this.generateClientsServicePort.generateClientId(
      clientPayload.name,
    );
    const client = Client.create({
      name: clientPayload.name,
      clientId: clientId,
      isConfidential: clientPayload.isConfidential || false,
      grantTypes: clientPayload.grantTypes,
      scopes: clientPayload.scopes,
      isActive: true,
      redirectUris: clientPayload.redirectUris,
    });
    let clientSecret = null;
    if (client.isConfidential) {
      const { clientSecretHashed, clientSecretPlainText } =
        this.generateClientsServicePort.generateClientSecret(
          this.configService.clientSecretPepper,
        );
      clientSecret = clientSecretPlainText;
      client.clientSecret = clientSecretHashed;
    }
    const clientDB = await this.clientRepositoryPort.create(client);
    clientDB.clientSecret = clientSecret;
    return clientDB;
  }
}
