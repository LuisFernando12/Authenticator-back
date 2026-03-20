import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IUserClientConsentResponse } from '../dto/user-client-consent-response.interface';
import { IUserClientConsent } from '../dto/user-client-consent.dto';
import { UserClientConsentRepository } from '../repository/user-client-consent.repository';
export interface IUserClientConsentService {
  create(userClientConsentPayload: IUserClientConsent): Promise<boolean>;
  findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<IUserClientConsentResponse[]>;
  findByUserId(userId: string): Promise<IUserClientConsentResponse[]>;
}
@Injectable()
export class UserClientConsentService implements IUserClientConsentService {
  constructor(
    private readonly userClientConsentRepository: UserClientConsentRepository,
  ) {}

  async create(userClientConsentPayload: IUserClientConsent): Promise<boolean> {
    const userClientConsentDB = await this.userClientConsentRepository.create(
      userClientConsentPayload,
    );
    if (!userClientConsentDB) {
      throw new InternalServerErrorException(
        'Failure to create user client consent',
      );
    }
    return true;
  }
  async findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<IUserClientConsentResponse[]> {
    if (!userId || !clientId) {
      throw new BadRequestException('Invalid params');
    }
    const userClientConsentDB =
      await this.userClientConsentRepository.findByUserIdAndClientId(
        userId,
        clientId,
      );
    if (!userClientConsentDB || userClientConsentDB.length === 0) {
      throw new NotFoundException('Consents not found');
    }
    return userClientConsentDB;
  }
  async findByUserId(userId: string): Promise<IUserClientConsentResponse[]> {
    if (!userId) {
      throw new BadRequestException('Invalid param');
    }
    const userClientConsentDB =
      await this.userClientConsentRepository.findByUserId(userId);
    if (!userClientConsentDB || userClientConsentDB.length === 0) {
      throw new NotFoundException('Consents not found');
    }
    return userClientConsentDB;
  }
}
