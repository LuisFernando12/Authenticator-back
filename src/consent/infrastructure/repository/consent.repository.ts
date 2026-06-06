import { ConsentEntity } from '@/consent/infrastructure/persistence/entity/consent.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consent, IClient } from '../../domain/entity/consent.entity';

export interface IConsentRepository {
  create(data: Consent): Promise<Consent>;
  findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent | null>;
  findByUserId(userId: string): Promise<Consent[]>;
  findByConsentId(consentId: string): Promise<Consent>;
}
@Injectable()
export class ConsentRepository implements IConsentRepository {
  constructor(
    @InjectRepository(ConsentEntity)
    private readonly consentRepository: Repository<ConsentEntity>,
  ) {}
  async create(data: Consent): Promise<Consent> {
    try {
      const userClientConsent = this.consentRepository.create(data);
      const consent = await this.consentRepository.save(userClientConsent);
      return new Consent({
        id: consent.id,
        scopes: consent.scopes,
        userId: consent.userId,
        clientId: consent.clientId,
        user: consent.user,
        client: consent.client as IClient,
        grantedAt: consent.grantedAt,
        expiresAt: consent.expiresAt,
        revokeAt: consent.revokeAt,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent> {
    const { clientId, userId } = payload;
    try {
      const consent = await this.consentRepository
        .createQueryBuilder('consent')
        .where('consent.userId = :userId', { userId })
        .andWhere('consent.clientId = :clientId', { clientId })
        .getOne();
      if (!consent) {
        return null;
      }
      return Consent.create({
        id: consent.id,
        scopes: consent.scopes,
        userId: consent.userId,
        clientId: consent.clientId,
        user: consent.user,
        client: consent.client as IClient,
        grantedAt: consent.grantedAt,
        expiresAt: consent.expiresAt,
        revokeAt: consent.revokeAt,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByUserId(userId: string): Promise<Consent[]> {
    try {
      const consents = await this.consentRepository.find({
        where: {
          userId,
        },
      });
      return consents.map((consent) =>
        Consent.create({
          id: consent.id,
          scopes: consent.scopes,
          userId: consent.userId,
          clientId: consent.clientId,
          user: consent.user,
          client: consent.client as IClient,
          grantedAt: consent.grantedAt,
          expiresAt: consent.expiresAt,
          revokeAt: consent.revokeAt,
        }),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByConsentId(consentId: string): Promise<Consent> {
    try {
      const consent = await this.consentRepository.findOne({
        where: {
          id: consentId,
        },
      });
      return Consent.create({
        id: consent.id,
        scopes: consent.scopes,
        userId: consent.userId,
        clientId: consent.clientId,
        user: consent.user,
        client: consent.client as IClient,
        grantedAt: consent.grantedAt,
        expiresAt: consent.expiresAt,
        revokeAt: consent.revokeAt,
      });
    } catch (_error) {
      throw new InternalServerErrorException('Failure to find consent');
    }
  }
}
