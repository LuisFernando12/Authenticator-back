export interface IAuthTokenProps {
  access_token: string;
  refresh_token: string;
  expiresAt: string;
}
export class AuthToken {
  constructor(private readonly tokenProps: IAuthTokenProps) {}
  get accessToken(): string {
    return this.tokenProps.access_token;
  }
  get refreshToken(): string {
    return this.tokenProps.refresh_token;
  }
  get expiresAt(): string {
    return this.tokenProps.expiresAt;
  }
}
