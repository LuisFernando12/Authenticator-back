import { Consent } from '../../domain/entity/consent.entity';

export const CONSENT_REPOSITORY_PORT = Symbol('CONSENT_REPOSITORY_PORT');
export abstract class ConsentRepositoryPort {
  abstract create(consent: Consent): Promise<void>;
  abstract findByUserId(userId: string): Promise<Consent[]>;
  abstract findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent | null>;
  abstract findByConsentId(id: string): Promise<Consent | null>;
}
