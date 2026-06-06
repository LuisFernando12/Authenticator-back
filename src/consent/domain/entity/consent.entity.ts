export interface IUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
}
export interface IClient {
  id: string;
  clientId: string;
  clientSecret: string;
  isConfidential: boolean;
  name: string;
  redirectUris: Array<string>;
  grantTypes: Array<string>;
  scopes: Array<string>;
  isActive: boolean;
  createdAt: Date;
}
export interface IConsentProps {
  id?: string;
  scopes: Array<string>;
  userId: string;
  clientId: string;
  user?: IUser;
  client?: IClient;
  grantedAt?: Date;
  expiresAt?: Date | null;
  revokeAt?: Date | null;
}
export class Consent {
  constructor(private readonly consentProps: IConsentProps) {}
  get id(): string {
    return this.consentProps.id;
  }
  get scopes(): Array<string> {
    return this.consentProps.scopes;
  }
  get userId(): string {
    return this.consentProps.userId;
  }
  get clientId(): string {
    return this.consentProps.clientId;
  }
  get user(): IUser {
    return this.consentProps.user;
  }
  get client(): IClient {
    return this.consentProps.client;
  }
  get grantedAt(): Date {
    return this.consentProps.grantedAt;
  }
  get expiresAt(): Date | null {
    return this.consentProps.expiresAt;
  }
  get revokeAt(): Date | null {
    return this.consentProps.revokeAt;
  }
  static create(consentProps: IConsentProps): Consent {
    return new Consent(consentProps);
  }
}
