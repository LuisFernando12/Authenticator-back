import { OauthDomainError } from '../error/oauth-domain.error';
import { OauthConsent } from './oauth-user-client-consent';
import { OauthUser } from './user.entity';

interface IOauthTokenProps {
  id: string;
  user: OauthUser;
  consent: OauthConsent;
  jti: string;
  consentId?: string;
  refreshToken: string;
  expiresAt: Date;
}
export class OauthToken {
  constructor(private readonly tokenProps: IOauthTokenProps) {}
  get id(): string {
    return this.tokenProps.id;
  }
  get user(): OauthUser {
    return this.tokenProps.user;
  }
  get consent(): OauthConsent {
    return this.tokenProps.consent;
  }
  get jti(): string {
    return this.tokenProps.jti;
  }
  get consentId(): string {
    return this.tokenProps.consentId;
  }
  get refreshToken(): string {
    return this.tokenProps.refreshToken;
  }
  get expiresAt(): Date {
    return this.tokenProps.expiresAt;
  }
  validateRefreshTokenIsValid() {
    if (new Date(this.tokenProps.expiresAt) < new Date()) {
      throw OauthDomainError.invalidRequest('Refresh token expired');
    }
  }
}
