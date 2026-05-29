import { IUserClientConsentService } from '../../../service/user-client-consent.service';
import { UserClientConsentServicePort } from '../../application/port/user-client-consent-service.port';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class UserClientConsentServiceAdapter implements UserClientConsentServicePort {
  constructor(
    private readonly userClientConsentService: IUserClientConsentService,
  ) {}
  async findByConsentId(consentId: string) {
    const userClientConsentDB =
      await this.userClientConsentService.findByConsentId(consentId);
    if (!userClientConsentDB) {
      throw new Error('Consents not found !');
    }
    return userClientConsentDB;
  }
  async findConsentByUserIdAndClientId(userId: string, clientId: string) {
    const userClientConsentDB =
      await this.userClientConsentService.findByUserIdAndClientId(
        userId,
        clientId,
      );
    if (!userClientConsentDB) {
      throw new Error('Consents not found !');
    }
    return userClientConsentDB;
  }
  async findOrCreateConsent(userId: string, clientId: string, scopes) {
    const userClientConsentDB =
      await this.userClientConsentService.findByUserIdAndClientId(
        userId,
        clientId,
      );
    if (!userClientConsentDB) {
      const createdConsent = await this.userClientConsentService.create({
        userId,
        clientId,
        scopes: scopes.split(' '),
      });
      if (!createdConsent) {
        throw OauthDomainError.internalServerError(
          'Failure to create consents !',
        );
      }
      return createdConsent;
    }
    return userClientConsentDB;
  }
}
