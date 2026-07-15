import { Client, IClientProps } from '@/client/domain/entity/client.entity';
import { ClientRepositoryFake } from './client-repository-fake';
import { ConfigServiceFake } from './config-service-fake';
import { GenerateClientsServiceFake } from './generate-clients-service-fake';

export const clientMocked = () => ({
  clientRepositoryFake: new ClientRepositoryFake(),
  generateClientsServiceFake: new GenerateClientsServiceFake(),
  configServiceFake: new ConfigServiceFake(),
  mockClient: (client: IClientProps) => new Client(client),
});

export type ClientMockedType = ReturnType<typeof clientMocked>;
