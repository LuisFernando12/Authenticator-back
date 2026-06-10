import { ConsentRepositoryPort } from '@/consent/application/port/consent-repository.port';
import { Consent } from '@/consent/domain/entity/consent.entity';

export class ConsentRepositoryFake implements ConsentRepositoryPort {
  private consent = Consent.create({
    id: 'test-consent-id',
    scopes: ['read', 'write'],
    userId: 'test-user-id',
    clientId: 'test-client-id',
    user: {
      id: 'test-user-id',
      name: 'John Doe',
      email: 'john.doe@example.com',
      isVerified: true,
      createdAt: new Date(),
    },
    client: {
      id: 'test-client-id',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      isConfidential: true,
      name: 'Test Client',
      redirectUris: ['https://example.com/callback'],
      grantTypes: ['authorization_code'],
      scopes: ['read', 'write'],
      isActive: true,
      createdAt: new Date(),
    },
    grantedAt: new Date(),
    expiresAt: null,
    revokeAt: null,
  });

  async create(_consent: Consent): Promise<void> {
    return;
  }

  async findByUserId(userId: string): Promise<Consent[]> {
    if (userId !== this.consent.userId) {
      throw new Error('Consents not found');
    }

    return [this.consent];
  }

  async findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent | null> {
    if (
      payload.userId !== this.consent.userId ||
      payload.clientId !== this.consent.clientId
    ) {
      return null;
    }

    return this.consent;
  }

  async findByConsentId(id: string): Promise<Consent | null> {
    if (id !== this.consent.id) {
      throw new Error('Consent not found');
    }

    return this.consent;
  }
}
