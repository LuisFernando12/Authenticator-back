import { OauthClient } from './oauth-client.entity';
import { OauthUser } from './user.entity';

export interface IOauthUserClientConsentProps {
  id: string;
  userId: string;
  clientId: string;
  user: OauthUser;
  client: OauthClient;
  grantedAt: Date;
  revokeAt: Date | null;
}

export class OauthUserClientConsent {
  constructor(
    private readonly oauthUserClientConsentProps: IOauthUserClientConsentProps,
  ) {}
  get id(): string {
    return this.oauthUserClientConsentProps.id;
  }
  get userId(): string {
    return this.oauthUserClientConsentProps.userId;
  }
  get clientId(): string {
    return this.oauthUserClientConsentProps.clientId;
  }
  get user(): OauthUser {
    return this.oauthUserClientConsentProps.user;
  }
  get client(): OauthClient {
    return this.oauthUserClientConsentProps.client;
  }
  get grantedAt(): Date {
    return this.oauthUserClientConsentProps.grantedAt;
  }
  get revokeAt(): Date | null {
    return this.oauthUserClientConsentProps.revokeAt;
  }
}
