export interface IOauthAccessTokenProps {
  token_type: 'Bearer';
  access_token: string;
  refresh_token: string;
  scope: string;
  expiresAt: string;
}
export class OauthAccessToken {
  constructor(private readonly oauthToken: IOauthAccessTokenProps) {}
  get tokenType(): string {
    return this.oauthToken.token_type;
  }
  get accessToken(): string {
    return this.oauthToken.access_token;
  }
  get refreshToken(): string {
    return this.oauthToken.refresh_token;
  }
  get expireAt(): string {
    return this.oauthToken.expiresAt;
  }
  get scope(): string {
    return this.oauthToken.scope;
  }
  toJSON() {
    return {
      token_type: this.tokenType,
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
      expires_at: this.expireAt,
      scope: this.scope,
    };
  }
}
