import { OauthRequest } from '../../domain/entity/oauth-request.entity';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';
import { MountUrlValueObject } from '../../domain/value-object/mount-url.value-object';
import { PkceChallengeValueObject } from '../../domain/value-object/pkce-challenge.value-object';
import { ClientServicePort } from '../port/client-service.port';
import { ConfigServicePort } from '../port/config-service.port';
import { GenerateIdServicePort } from '../port/generate-id-service.port';
import { RedisServicePort } from '../port/redis-service-port';

export interface IAuthorizeUseCaseDTO {
  responseType: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

type MountUrlParamType = IAuthorizeUseCaseDTO & { oauthRequestId: string };

export class AuthorizeUseCase {
  constructor(
    private readonly clientServicePort: ClientServicePort,
    private readonly generateIdServicePort: GenerateIdServicePort,
    private readonly redisServicePort: RedisServicePort,
    private readonly configServicePort: ConfigServicePort,
  ) {}
  async execute(payload: IAuthorizeUseCaseDTO): Promise<URL> {
    const {
      responseType,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state,
      scope,
    } = payload;
    if (responseType !== 'code') {
      throw OauthDomainError.invalidGrant(
        `Unsupported response type ${responseType}`,
      );
    }

    const pkceChallenge = PkceChallengeValueObject.create(
      codeChallenge,
      codeChallengeMethod,
    );

    const clientDB = await this.clientServicePort.findByClientId(clientId);
    clientDB.isValidRedirectUri(redirectUri);
    clientDB.isValidScopes(scope);
    clientDB.startAuthorizationCodeFlow(Boolean(pkceChallenge));

    const oauthRequestId = this.generateIdServicePort.generateOauthRequestId();

    const payloadOauthResquest = OauthRequest.create({
      oauthRequestId,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state,
      scope,
    });
    await this.redisServicePort.saveAuthRequest(payloadOauthResquest);

    payload['oauthRequestId'] = oauthRequestId;
    return MountUrlValueObject.mount<MountUrlParamType>(
      this.configServicePort.oauthLoginURL,
      payload as MountUrlParamType,
    );
  }
}
