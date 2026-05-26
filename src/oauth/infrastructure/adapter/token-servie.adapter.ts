/* eslint-disable preserve-caught-error */
import { ITokenService } from '../../../service/token.service';
import {
  IPayloadToken,
  ITokenIntrospectResponse,
  TokenServicePort,
} from '../../application/port/token-service.port';
import { OauthAccessToken } from '../../domain/entity/oauth-access-token.entity';
import { OauthToken } from '../../domain/entity/oauth-token.entity';

export class TokenServiceAdapter implements TokenServicePort {
  constructor(private readonly tokenService: ITokenService) {}
  async generateToken(
    payload: IPayloadToken,
    userClientConsentId: string,
  ): Promise<OauthAccessToken> {
    const accessToken = await this.tokenService.generateToken(
      {
        sub: payload.sub,
        username: payload.username,
        scope: payload.scope,
        aud: payload.aud,
        iss: payload.iss,
      },
      userClientConsentId,
    );
    if (!accessToken) {
      throw new Error('Failure to generate token');
    }

    return new OauthAccessToken({
      token_type: 'Bearer',
      access_token: accessToken.access_token,
      refresh_token: accessToken.refresh_token,
      scope: payload.scope,
      expiresAt: accessToken.expiresAt,
    });
  }
  hashRefreshToken(refreshToken: string): string {
    return this.tokenService.hashRefreshToken(refreshToken);
  }
  async refreshToken(
    payload: IPayloadToken,
    token: string,
    consentId?: string,
  ): Promise<OauthAccessToken> {
    const { sub, username, scope, aud, iss } = payload;

    const newAccessToken = await this.tokenService.refreshToken(
      {
        sub: sub,
        username: username,
        scope: scope,
        aud: aud,
        iss: iss,
      },
      token,
      consentId,
    );
    if (!newAccessToken || typeof newAccessToken !== 'object') {
      throw new Error('Failure to generate token');
    }
    return new OauthAccessToken({
      token_type: 'Bearer',
      access_token: newAccessToken.access_token,
      refresh_token: newAccessToken.refresh_token,
      scope: payload.scope,
      expiresAt: newAccessToken.expiresAt,
    });
  }
  async findByRefreshToken(refreshToken: string): Promise<OauthToken> {
    const oauthToken = await this.tokenService.findByRefreshToken(refreshToken);
    return new OauthToken(oauthToken);
  }
  async revokeToken(refreshToken: string): Promise<void> {
    try {
      await this.tokenService.revokeToken(refreshToken);
    } catch (_error) {
      throw new Error('Failure to revoke token');
    }
  }
  async tokenIntrospect(
    token: string,
  ): Promise<ITokenIntrospectResponse | { active: boolean }> {
    return await this.tokenService.tokenIntrospect(token);
  }
}
