import { ConsentService } from '../../../consent/application/service/consent.service';
import { ConsentServicePort } from '../../application/port/user-client-consent-service.port';
import { OauthClient } from '../../domain/entity/oauth-client.entity';
import { OauthConsent } from '../../domain/entity/oauth-user-client-consent';
import { OauthUser } from '../../domain/entity/user.entity';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class ConsentServiceAdapter implements ConsentServicePort {
  constructor(private readonly consentService: ConsentService) {}
  async findByConsentId(consentId: string): Promise<OauthConsent> {
    const consentDB = await this.consentService.findByConsentId(consentId);
    if (!consentDB) {
      throw OauthDomainError.invalidGrant('Consents not found !');
    }
    return new OauthConsent({
      id: consentDB.id,
      userId: consentDB.userId,
      clientId: consentDB.clientId,
      user: consentDB.user as OauthUser,
      scopes: consentDB.scopes,
      client: new OauthClient({ ...consentDB.client }),
      grantedAt: consentDB.grantedAt,
      revokeAt: consentDB.revokeAt,
    });
  }
  async findConsentByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<OauthConsent> {
    const userClientConsentDB =
      await this.consentService.findByUserIdAndClientId({ userId, clientId });
    if (!userClientConsentDB) {
      throw OauthDomainError.invalidGrant('Consents not found !');
    }
    return new OauthConsent({
      id: userClientConsentDB.id,
      userId: userClientConsentDB.userId,
      clientId: userClientConsentDB.clientId,
      scopes: userClientConsentDB.scopes,
      user: userClientConsentDB.user as OauthUser,
      client: new OauthClient({ ...userClientConsentDB.client }),
      grantedAt: userClientConsentDB.grantedAt,
      revokeAt: userClientConsentDB.revokeAt,
    });
  }
  async findOrCreateConsent(
    userId: string,
    clientId: string,
    scopes: string,
  ): Promise<void | OauthConsent> {
    const consentDB = await this.consentService.findByUserIdAndClientId({
      userId,
      clientId,
    });
    if (!consentDB) {
      await this.consentService.create({
        scopes: scopes.split(' '),
        userId: userId,
        clientId: clientId,
      });
      return;
    }
    return new OauthConsent({
      id: consentDB.id,
      userId: consentDB.userId,
      clientId: consentDB.clientId,
      user: consentDB.user as OauthUser,
      scopes: consentDB.scopes,
      client: new OauthClient({ ...consentDB.client }),
      grantedAt: consentDB.grantedAt,
      revokeAt: consentDB.revokeAt,
    });
  }
}
