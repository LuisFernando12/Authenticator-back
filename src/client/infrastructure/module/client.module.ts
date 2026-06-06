import { ClientEntity } from '@/client/infrastructure/persistence/entity/client.entity';
import {
  ClientRepository,
  IClientRepository,
} from '@/client/infrastructure/repository/client.repository';
import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CLIENT_REPOSITORY_PORT,
  ClientRepositoryPort,
} from '../../application/port/client-repository.port';
import {
  CONFIG_SERVICE_PORT,
  ConfigServicePort,
} from '../../application/port/config-service.port';
import {
  GENERATE_CLIENTS_SERVICE_PORT,
  GenerateClientsServicePort,
} from '../../application/port/generate-clients-service.port';
import { CreateClientUseCase } from '../../application/use-case/create-client.use-case';
import { FindByClientIdUseCase } from '../../application/use-case/find-by-clientId.use-case';
import { ClientRepositoryAdapter } from '../adapter/client-repository.adapter';
import { ConfigServiceAdapter } from '../adapter/config-service.adapter';
import { GenerateClientsServiceAdapter } from '../adapter/generate-clients-service';
import { ClientController } from '../controller/client.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [
    ClientRepository,
    {
      provide: AppConfigEnvService,
      useFactory: (configService: ConfigService) =>
        new AppConfigEnvService(configService),
      inject: [ConfigService],
    },
    {
      provide: CLIENT_REPOSITORY_PORT,
      useFactory: (clientRepository: IClientRepository): ClientRepositoryPort =>
        new ClientRepositoryAdapter(clientRepository),
      inject: [ClientRepository],
    },
    {
      provide: CONFIG_SERVICE_PORT,
      useFactory: (
        appConfigEnvService: AppConfigEnvService,
      ): ConfigServicePort => new ConfigServiceAdapter(appConfigEnvService),
      inject: [AppConfigEnvService],
    },
    {
      provide: GENERATE_CLIENTS_SERVICE_PORT,
      useFactory: (): GenerateClientsServicePort =>
        new GenerateClientsServiceAdapter(),
    },
    {
      provide: CreateClientUseCase,
      useFactory: (
        clientRepositoryPort: ClientRepositoryPort,
        generateClientsServicePort: GenerateClientsServicePort,
        configService: ConfigServicePort,
      ) =>
        new CreateClientUseCase(
          clientRepositoryPort,
          generateClientsServicePort,
          configService,
        ),
      inject: [
        CLIENT_REPOSITORY_PORT,
        GENERATE_CLIENTS_SERVICE_PORT,
        CONFIG_SERVICE_PORT,
      ],
    },
    {
      provide: FindByClientIdUseCase,
      useFactory: (clientRepositoryPort: ClientRepositoryPort) =>
        new FindByClientIdUseCase(clientRepositoryPort),
      inject: [CLIENT_REPOSITORY_PORT],
    },
  ],
  exports: [ClientRepository],
})
export class ClientModule {}
