import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserClientConsentResponse } from '../dto/user-client-consent-response.interface';
import { IUserClientConsent } from '../dto/user-client-consent.dto';
import { UserClientConsentEntity } from '../entity/user-client-consent.entity';
export interface IUserClientConsentRepository {
  create(data: Partial<IUserClientConsent>): Promise<any>;
  findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<UserClientConsentEntity>;
  findByUserId(userId: string): Promise<UserClientConsentEntity[]>;
  findByConsentId(consentId: string): Promise<UserClientConsentEntity>;
}
@Injectable()
export class UserClientConsentRepository implements IUserClientConsentRepository {
  constructor(
    @InjectRepository(UserClientConsentEntity)
    private readonly userClientConsentRespository: Repository<UserClientConsentEntity>,
  ) {}
  async create(
    data: Partial<IUserClientConsent>,
  ): Promise<IUserClientConsentResponse> {
    try {
      const userClientConsent = this.userClientConsentRespository.create({
        ...data,
        clientId: data.clientId,
        userId: data.userId,
      });
      return await this.userClientConsentRespository.save(userClientConsent);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<UserClientConsentEntity> {
    try {
      return await this.userClientConsentRespository
        .createQueryBuilder('userClientConsent')
        .where('userClientConsent.userId = :userId', { userId })
        .andWhere('userClientConsent.clientId = :clientId', { clientId })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByUserId(userId: string): Promise<UserClientConsentEntity[]> {
    try {
      return this.userClientConsentRespository.find({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByConsentId(consentId: string): Promise<UserClientConsentEntity> {
    try {
      return this.userClientConsentRespository.findOne({
        where: {
          id: consentId,
        },
      });
    } catch (_error) {
      throw new InternalServerErrorException('Failure to find consent');
    }
  }
}
