import { BaseUseCase } from '@/core/application/use-case/base.use-case';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';
import { OauthRefreshTokenDTO } from '../../infrastructure/dto/oauth-authorize.dto';
import { ConfigServicePort } from '../port/config-service.port';
import { IPayloadToken, TokenServicePort } from '../port/token-service.port';
import { ConsentServicePort } from '../port/user-client-consent-service.port';
import { UserServicePort } from '../port/user-service.port';

export class RefreshTokenUseCase implements BaseUseCase<OauthRefreshTokenDTO> {
  constructor(
    private readonly tokenServicePort: TokenServicePort,
    private readonly userServicePort: UserServicePort,
    private readonly userClientConsentServicePort: ConsentServicePort,
    private readonly configServicePort: ConfigServicePort,
  ) {}
  async execute(payload: OauthRefreshTokenDTO): Promise<any> {
    const { refreshToken, grantType } = payload;
    if (grantType !== 'refresh_token') {
      throw OauthDomainError.invalidGrant(
        `Invalid grant type: ${payload.grantType || ''}`,
      );
    }
    const refreshTokenHashed =
      this.tokenServicePort.hashRefreshToken(refreshToken);
    const refreshTokenDB =
      await this.tokenServicePort.findByRefreshToken(refreshTokenHashed);
    refreshTokenDB.validateRefreshTokenIsValid();
    const { email } = refreshTokenDB.user;
    const userDB = await this.userServicePort.findByEmail(email);
    const { id: userId } = userDB;
    const userClientConsentDB =
      await this.userClientConsentServicePort.findByConsentId(
        refreshTokenDB.consentId,
      );
    const { scopes, clientId, id: consentId } = userClientConsentDB;
    const payloadToken: IPayloadToken = {
      sub: userId,
      username: email,
      scope: scopes.join(' '),
      aud: clientId,
      iss: this.configServicePort.serviceURL,
    };
    return await this.tokenServicePort.refreshToken(
      payloadToken,
      refreshTokenHashed,
      consentId,
    );
  }
}
