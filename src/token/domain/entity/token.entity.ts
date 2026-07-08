import { TokenDomainError } from '../error/token-domain.error';

interface IClient {
  clientId: string;
  clientSecret?: string;
  isConfidential: boolean;
  name: string;
  redirectUris: Array<string>;
  scopes: Array<string>;
  isActive: boolean;
}
interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
}
export interface IConsent {
  id: string;
  userId: string;
  clientId: string;
  user: IUser;
  scopes: Array<string>;
  client: IClient;
  grantedAt: Date;
  revokeAt: Date | null;
}
export interface ITokenProps {
  id?: string;
  user?: IUser;
  userId?: string;
  jti: string;
  tokenFamilyId: string;
  consentId?: string;
  consent?: IConsent;
  refreshToken: string;
  expiresAt: Date;
}

export class Token {
  constructor(private readonly tokenProps: ITokenProps) {}
  get id(): string {
    return this.tokenProps.id;
  }
  get user(): IUser {
    return this.tokenProps.user;
  }
  get userId(): string {
    return this.tokenProps.userId;
  }
  get jti(): string {
    return this.tokenProps.jti;
  }
  get tokenFamilyId(): string {
    return this.tokenProps.tokenFamilyId;
  }
  get consentId(): string {
    return this.tokenProps.consentId;
  }
  get consent(): IConsent {
    return this.tokenProps.consent;
  }
  get refreshToken(): string {
    return this.tokenProps.refreshToken;
  }
  get expiresAt(): Date {
    return this.tokenProps.expiresAt;
  }
  private set expiresAt(expiresAt: Date) {
    this.tokenProps.expiresAt = expiresAt;
  }
  private set refreshToken(refreshToken: string) {
    this.tokenProps.refreshToken = refreshToken;
  }
  private set jti(jti: string) {
    this.tokenProps.jti = jti;
  }
  refreshTokenUpdate(refreshToken: string, jti: string, expiresAt: Date) {
    if (new Date(this.tokenProps.expiresAt) < new Date()) {
      throw TokenDomainError.unauthorized('Token expired');
    }
    this.refreshToken = refreshToken;
    this.jti = jti;
    this.expiresAt = expiresAt;
  }
  toJSON() {
    return {
      id: this.id,
      user: this.user,
      userId: this.userId,
      jti: this.jti,
      tokenFamilyId: this.tokenFamilyId,
      consentId: this.consentId,
      consent: this.consent,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt,
    };
  }
}
