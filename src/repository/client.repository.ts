import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaveClientDTO } from '../dto/save-client.dto';
import { ClientEntity } from '../entity/client.entity';

export class ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}
  async save(client: SaveClientDTO) {
    try {
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByClientId(clientId: string) {
    try {
      return await this.clientRepository.findOne({
        where: {
          clientId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByClientSecret(clientSecret: string) {
    try {
      return await this.clientRepository.findOne({
        where: {
          clientSecret,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
