import { OauthError } from '@/config/errors/oauth.error';
import { SaveClientDTO } from '@/dto/save-client.dto';
import { ClientEntity } from '@/entity/client.entity';
import { ClientRepository } from '@/repository/client.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes, randomUUID } from 'node:crypto';
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
    client['clientSecret'] = bcrypt.hashSync(
      clientSecret + this.configEnvService.clientSecretPepper,
      10,
    );
    try {
      const clientDB = await this.clientRepository.create(client);
      clientDB.clientSecret = clientSecret;
      return clientDB;
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
