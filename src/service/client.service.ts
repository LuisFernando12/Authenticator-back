import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { SaveClientDTO } from '../dto/save-client.dto';
import { ClientEntity } from '../entity/client.entity';
import { ClientRepository } from '../repository/client.repository';
@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}
  async create(client: SaveClientDTO) {
    client['clientId'] = client.name.split(' ')[0] + '-' + randomUUID();
    const clientSecret = randomBytes(64).toString('hex');
    client['clientSecret'] = createHash('sha256')
      .update(clientSecret)
      .digest('hex');
    try {
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByClientId(
    clientId: string,
    clientSecret?: string,
  ): Promise<ClientEntity> {
    if (!clientId) {
      throw new InternalServerErrorException('Client ID not found');
    }
    try {
      const clientDB = await this.clientRepository.findByClientId(clientId);
      if (!clientDB) {
        throw new InternalServerErrorException('Client not found');
      }
      if (clientSecret) {
        const clientSecretDB = createHash('sha256')
          .update(clientDB.clientSecret)
          .digest('hex');
        if (clientDB.clientSecret !== clientSecretDB) {
          throw new InternalServerErrorException('Invalid client secret');
        }
      }
      return clientDB;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
