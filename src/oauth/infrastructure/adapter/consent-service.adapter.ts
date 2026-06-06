import { ConsentService } from '../../../consent/application/service/consent.service';
import { ConsentServicePort } from '../../application/port/user-client-consent-service.port';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class ConsentServiceAdapter implements ConsentServicePort {
  constructor(private readonly consentService: ConsentService) {}
  async findByConsentId(consentId: string) {
    const userClientConsentDB =
      await this.consentService.findByConsentId(consentId);
    if (!userClientConsentDB) {
      throw OauthDomainError.invalidGrant('Consents not found !');
    }
    return userClientConsentDB;
  }
  async findConsentByUserIdAndClientId(userId: string, clientId: string) {
    const userClientConsentDB =
      await this.consentService.findByUserIdAndClientId({ userId, clientId });
    if (!userClientConsentDB) {
      throw OauthDomainError.invalidGrant('Consents not found !');
    }
    return userClientConsentDB;
  }
  async findOrCreateConsent(userId: string, clientId: string, scopes) {
    const userClientConsentDB =
      await this.consentService.findByUserIdAndClientId({ userId, clientId });
    if (!userClientConsentDB) {
      const createdConsent = await this.consentService.create({
        scopes: scopes.split(' '),
        userId: userId,
        clientId: clientId,
      });
      return createdConsent;
    }
    return userClientConsentDB;
  }
}
