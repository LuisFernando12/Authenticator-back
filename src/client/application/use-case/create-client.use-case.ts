import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Client, IClientProps } from '../../domain/entity/client.entity';
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
  async execute(clientPayload: IPayloadCreateClient): Promise<IClientProps> {
    const clientId = this.generateClientsServicePort.generateClientId(
      clientPayload.name,
    );
    let clientSecretHashed: string = null;
    let clientSecretPlainText: string = null;
    if (clientPayload.isConfidential) {
      const clientSecret =
        await this.generateClientsServicePort.generateClientSecret(
          this.configService.clientSecretPepper,
        );
      clientSecretHashed = clientSecret.clientSecretHashed;
      clientSecretPlainText = clientSecret.clientSecretPlainText;
    }
    const client = Client.create({
      name: clientPayload.name,
      clientId: clientId,
      isConfidential: clientPayload.isConfidential || false,
      grantTypes: clientPayload.grantTypes,
      scopes: clientPayload.scopes,
      isActive: true,
      redirectUris: clientPayload.redirectUris,
      clientSecret: clientSecretHashed,
    });
    const clientDB = await this.clientRepositoryPort.create(client);
    return { ...clientDB.toJSON(), clientSecret: clientSecretPlainText };
  }
}
