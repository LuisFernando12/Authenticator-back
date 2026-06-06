import { ConsentRepositoryPort } from '../../application/port/consent-repository.port';
import { Consent } from '../../domain/entity/consent.entity';
import { ConsentDomainError } from '../../domain/error/consent-domain.error';
import { ConsentRepository } from '../repository/consent.repository';

export class ConsentRepositoryAdapter implements ConsentRepositoryPort {
  constructor(private readonly consentRepository: ConsentRepository) {}
  async create(consent: Consent): Promise<void> {
    const consentDB = await this.consentRepository.create(consent);
    if (!consentDB) {
      throw ConsentDomainError.internalServerError(
        'Failure to create user client consent',
      );
    }
  }
  async findByUserId(userId: string): Promise<Consent[] | []> {
    const consentDB = await this.consentRepository.findByUserId(userId);
    if (!consentDB || consentDB.length === 0) {
      throw ConsentDomainError.notFound('Consents not found');
    }
    return consentDB || [];
  }
  async findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent> {
    const { userId, clientId } = payload;
    const consent = await this.consentRepository.findByUserIdAndClientId({
      userId,
      clientId,
    });
    return consent || null;
  }
  async findByConsentId(consentId: string): Promise<Consent> {
    if (!consentId) {
      throw ConsentDomainError.badRequest('Invalid param');
    }
    const consentDB = await this.consentRepository.findByConsentId(consentId);
    if (!consentDB) {
      throw ConsentDomainError.notFound('Consent not found');
    }
    return consentDB;
  }
}
