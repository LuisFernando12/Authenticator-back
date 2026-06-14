import { OauthClient } from './oauth-client.entity';
import { OauthUser } from './user.entity';

export interface IOauthConsentProps {
  id: string;
  userId: string;
  clientId: string;
  user: OauthUser;
  scopes: Array<string>;
  client: OauthClient;
  grantedAt: Date;
  revokeAt: Date | null;
}

export class OauthConsent {
  constructor(private readonly oauthConsentProps: IOauthConsentProps) {}
  get id(): string {
    return this.oauthConsentProps.id;
  }
  get userId(): string {
    return this.oauthConsentProps.userId;
  }
  get clientId(): string {
    return this.oauthConsentProps.clientId;
  }
  get user(): OauthUser {
    return this.oauthConsentProps.user;
  }
  get client(): OauthClient {
    return this.oauthConsentProps.client;
  }
  get scopes(): Array<string> {
    return this.oauthConsentProps.scopes;
  }
  get grantedAt(): Date {
    return this.oauthConsentProps.grantedAt;
  }
  get revokeAt(): Date | null {
    return this.oauthConsentProps.revokeAt;
  }
}
