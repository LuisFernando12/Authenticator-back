import {
  IPayloadToken,
  ITokenIntrospectResponse,
  TokenServicePort,
} from '@/oauth/application/port/token-service.port';
import { OauthAccessToken } from '../../../../../src/oauth/domain/entity/oauth-access-token.entity';
import { OauthClient } from '../../../../../src/oauth/domain/entity/oauth-client.entity';
import { OauthToken } from '../../../../../src/oauth/domain/entity/oauth-token.entity';
import { OauthConsent } from '../../../../../src/oauth/domain/entity/oauth-user-client-consent';
import { OauthUser } from '../../../../../src/oauth/domain/entity/user.entity';
export class TokenServiceFake implements TokenServicePort {
  private _user: OauthUser = jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test-user-email',
    password: 'test-user-password',
    name: 'test-user-name',
    isVerified: true,
    createdAt: new Date(),
  }) as any;

  private _client: OauthClient = jest.fn().mockResolvedValue({
    id: 'test-client-id',
    name: 'Test Client',
    redirectUris: ['http://localhost/callback'],
    isValidRedirectUri: jest.fn().mockReturnValue(true),
    startAuthorizationCodeFlow: jest.fn(),
    scopes: ['read', 'write'],
    isActive: true,
    clientSecret: 'test-client-secret',
    isConfidential: true,
  }) as any;

  private _consent: OauthConsent = jest.fn().mockResolvedValue({
    id: 'test-consent-id',
    userId: 'test-user-id',
    clientId: 'test-client-id',
    user: this._user,
    client: this._client,
    grantedAt: new Date(),
    revokeAt: null,
  }) as any;
  get user() {
    return this._user;
  }
  get client() {
    return this._client;
  }
  get consent() {
    return this._consent;
  }

  async generateToken(
    payload: IPayloadToken,
    _userClientConsentId: string,
  ): Promise<OauthAccessToken> {
    return Promise.resolve(
      new OauthAccessToken({
        token_type: 'Bearer',
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        scope: payload.scope,
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
      }),
    );
  }
  hashRefreshToken(refreshToken: string): string {
    return 'hashed-' + refreshToken;
  }
  async refreshToken(
    payload: IPayloadToken,
    _refreshTokenHashed: string,
  ): Promise<OauthAccessToken> {
    return new OauthAccessToken({
      token_type: 'Bearer',
      access_token: 'test-access-token',
      refresh_token: 'refresh-token',
      scope: payload.scope,
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  }
  async findByRefreshToken(refreshToken: string): Promise<OauthToken> {
    if (refreshToken === 'hashed-test-refresh-token') {
      const token = new OauthToken({
        id: 'test-token-id',
        user: this._user,
        consent: this._consent,
        refreshToken: 'test-refresh-token',
        jti: 'test-jti',
        expiresAt: new Date(Date.now() + 3600 * 1000),
        consentId: 'test-consent-id',
      });
      return Promise.resolve(token);
    }
    return Promise.resolve(null);
  }
  async revokeToken(_refreshToken: string): Promise<void> {
    return Promise.resolve();
  }
  async tokenIntrospect(
    token: string,
  ): Promise<ITokenIntrospectResponse | { active: boolean }> {
    if (token === 'test-access-token') {
      return Promise.resolve({
        active: true,
        scope: 'read write',
        client_id: 'test-client-id',
        username: 'test-user',
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
    }
    return Promise.resolve({ active: false });
  }
}
