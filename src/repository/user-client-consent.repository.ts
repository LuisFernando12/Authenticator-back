import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserClientConsentResponseDTO } from '../dto/user-client-consent-response.dto';
import { UserClientConsentDTO } from '../dto/user-client-consent.dto';
import { UserClientConsentEntity } from '../entity/user-client-consent.entity';
export interface IUserClientConsentRepository {
  create(data: Partial<UserClientConsentDTO>): Promise<any>;
  findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<UserClientConsentEntity[]>;
  findByUserId(userId: string): Promise<UserClientConsentEntity[]>;
}
@Injectable()
export class UserClientConsentRepository implements IUserClientConsentRepository {
  constructor(
    @InjectRepository(UserClientConsentEntity)
    private readonly userClientConsentRespository: Repository<UserClientConsentEntity>,
  ) {}
  async create(
    data: Partial<UserClientConsentDTO>,
  ): Promise<UserClientConsentResponseDTO> {
    try {
      const userClientConsent = this.userClientConsentRespository.create({
        ...data,
        clients: {
          clientId: data.clientId,
        },
        users: {
          id: data.userId,
        },
      });
      return await this.userClientConsentRespository.save(userClientConsent);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<UserClientConsentEntity[]> {
    try {
      return this.userClientConsentRespository.find({
        where: {
          users: {
            id: userId,
          },
          clients: {
            clientId: clientId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findByUserId(userId: string): Promise<UserClientConsentEntity[]> {
    try {
      return this.userClientConsentRespository.find({
        where: {
          users: {
            id: userId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
