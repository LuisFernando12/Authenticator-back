import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../persistence/entity/client.entity';

type ICreateClientPayload = Omit<
  ClientEntity,
  'id' | 'createdAt' | 'userClientConsent'
>;
export interface IClientRepository {
  create(client: ICreateClientPayload): Promise<ClientEntity>;
  findByClientId(clientId: string): Promise<ClientEntity>;
  findByClientSecret(clientSecret: string): Promise<ClientEntity>;
}

@Injectable()
export class ClientRepository implements IClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) {}
  async create(client: ICreateClientPayload) {
    try {
      return await this.clientRepository.save(client);
    } catch (error: any) {
      if (error.code && error.code === '23505') {
        throw new ConflictException('Client already exists');
      }
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
