import { OauthError } from '@/config/errors/oauth.error';
import { SaveClientDTO } from '@/dto/save-client.dto';
import { ClientEntity } from '@/entity/client.entity';
import { ClientRepository } from '@/repository/client.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHmac, randomBytes, randomUUID } from 'node:crypto';
import { AppConfigEnvService } from './app-config-env.service';

export interface IClientService {
  create(client: SaveClientDTO): Promise<ClientEntity>;
  findByClientId(clientId: string): Promise<ClientEntity>;
}

@Injectable()
export class ClientService implements IClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly configEnvService: AppConfigEnvService,
  ) {}
  async create(client: SaveClientDTO) {
    client['clientId'] = client.name.split(' ')[0] + '-' + randomUUID();
    const clientSecret = randomBytes(64).toString('hex');
    client['clientSecret'] = createHmac(
      'sha256',
      this.configEnvService.clientSecretPepper,
    )
      .update(clientSecret)
      .digest('hex');
    try {
      return await this.clientRepository.create(client);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByClientId(clientId: string): Promise<ClientEntity> {
    if (!clientId) {
      throw OauthError.invalidGrant('Client ID not found');
    }
    const clientDB = await this.clientRepository.findByClientId(clientId);
    if (!clientDB) {
      throw OauthError.invalidClient('Client not found');
    }
    return clientDB;
  }
}
