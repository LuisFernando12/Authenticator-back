import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserClientConsentResponseDTO } from '../dto/user-client-consent-response.dto';
import { UserClientConsentDTO } from '../dto/user-client-consent.dto';
import { UserClientConsentRepository } from '../repository/user-client-consent.repository';
interface IUserClientConsentService {
  create(userClientConsentPayload: UserClientConsentDTO): Promise<boolean>;
  findByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<UserClientConsentResponseDTO[]>;
  findByUserId(userId: string): Promise<UserClientConsentResponseDTO[]>;
}
@Injectable()
export class UserClientConsentService implements IUserClientConsentService {
  constructor(
    private readonly userClientConsentRepository: UserClientConsentRepository,
  ) {}

  async create(
    userClientConsentPayload: UserClientConsentDTO,
  ): Promise<boolean> {
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
  ): Promise<UserClientConsentResponseDTO[]> {
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
  async findByUserId(userId: string): Promise<UserClientConsentResponseDTO[]> {
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
