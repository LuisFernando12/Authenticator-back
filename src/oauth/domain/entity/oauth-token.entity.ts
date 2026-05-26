interface IOauthTokenProps {
  id: string;
  user: any;
  userClientConsent: any;
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
  get user(): any {
    return this.tokenProps.user;
  }
  get userClientConsent(): any {
    return this.tokenProps.userClientConsent;
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
  get expireAt(): Date {
    return this.tokenProps.expiresAt;
  }
  validateRefreshTokenIsValid() {
    console.log(this.tokenProps.expiresAt);
    if (new Date(this.tokenProps.expiresAt) < new Date()) {
      throw new Error('Refresh token expired');
    }
  }
}
