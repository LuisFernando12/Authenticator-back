import { TokenDomainError } from '../error/token-domain.error';

export interface ITokenProps {
  id?: string;
  user: { id: string };
  jti: string;
  consentId?: string;
  userClientConsent?: any;
  refreshToken: string;
  expiresAt: Date;
}
export class Token {
  constructor(private readonly tokenProps: ITokenProps) {}
  get id(): string {
    return this.tokenProps.id;
  }
  get user(): any {
    return this.tokenProps.user;
  }
  get jti(): string {
    return this.tokenProps.jti;
  }
  get consentId(): string {
    return this.tokenProps.consentId;
  }
  get userClientConsent(): any {
    return this.tokenProps.userClientConsent;
  }
  get refreshToken(): string {
    return this.tokenProps.refreshToken;
  }
  get expiresAt(): Date {
    return this.tokenProps.expiresAt;
  }
  refreshTokenUpdate(refreshToken: string, jti: string, expiresAt: Date) {
    if (new Date(this.tokenProps.expiresAt) < new Date()) {
      throw TokenDomainError.unauthorized('Token expired');
    }
    this.tokenProps.jti = jti;
    this.tokenProps.refreshToken = refreshToken;
    this.tokenProps.expiresAt = expiresAt;
  }
  toJSON() {
    return {
      id: this.id,
      user: this.user,
      jti: this.jti,
      consentId: this.consentId,
      userClientConsent: this.userClientConsent,
      refreshToken: this.refreshToken,
      expiresAt: this.expiresAt,
    };
  }
}
