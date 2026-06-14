import { createHash } from 'node:crypto';
import { ITokenService } from '../../../token/application/service/token.service';
import {
  IPayloadToken,
  ITokenIntrospectResponse,
  TokenServicePort,
} from '../../application/port/token-service.port';
import { OauthAccessToken } from '../../domain/entity/oauth-access-token.entity';
import { OauthClient } from '../../domain/entity/oauth-client.entity';
import { OauthToken } from '../../domain/entity/oauth-token.entity';
import { OauthConsent } from '../../domain/entity/oauth-user-client-consent';
import { OauthUser } from '../../domain/entity/user.entity';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class TokenServiceAdapter implements TokenServicePort {
  constructor(private readonly tokenService: ITokenService) {}
  async generateToken(
    payload: IPayloadToken,
    userClientConsentId: string,
  ): Promise<OauthAccessToken> {
    const accessToken = await this.tokenService.generate({
      payload,
      consentId: userClientConsentId,
    });
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
    return createHash('sha256').update(refreshToken).digest('base64url');
  }
  async refreshToken(
    payload: IPayloadToken,
    token: string,
  ): Promise<OauthAccessToken> {
    const newAccessToken = await this.tokenService.refreshToken({
      payload,
      oldRefreshToken: token,
    });
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
    if (!oauthToken) {
      throw OauthDomainError.invalidClient();
    }
    const { id, user, userClientConsent, jti, consentId, expiresAt } =
      oauthToken;
    return new OauthToken({
      id,
      user: new OauthUser(user),
      consent: new OauthConsent({
        id: userClientConsent.id,
        userId: userClientConsent.userId,
        clientId: userClientConsent.clientId,
        user: new OauthUser(userClientConsent.user),
        scopes: userClientConsent.scopes,
        client: new OauthClient(userClientConsent.client),
        grantedAt: userClientConsent.grantedAt,
        revokeAt: userClientConsent.revokeAt,
      }),
      jti,
      consentId,
      refreshToken,
      expiresAt,
    });
  }
  async revokeToken(refreshToken: string): Promise<void> {
    try {
      await this.tokenService.revoke(refreshToken);
    } catch (_error) {
      throw OauthDomainError.internalServerError('Failure to revoke token');
    }
  }
  async tokenIntrospect(
    token: string,
  ): Promise<ITokenIntrospectResponse | { active: boolean }> {
    return await this.tokenService.tokenIntrospect(token);
  }
}
