import { MountUrlValueObject } from '../../domain/value-object/mount-url.value-object';
import { GenerateIdServicePort } from '../port/generate-id-service.port';
import { RedisServicePort } from '../port/redis-service-port';
import { ConsentServicePort } from '../port/user-client-consent-service.port';
import { UserServicePort } from '../port/user-service.port';

export interface IQueryOauthLogin {
  oauthRequestId: string;
  responseType: string;
  clientId: string;
  redirectUri: string;
  state: string;
  scope: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
}

export class LoginUseCase {
  constructor(
    private readonly redisServicePort: RedisServicePort,
    private readonly userServicePort: UserServicePort,
    private readonly consentServicePort: ConsentServicePort,
    private readonly generateIdServicePort: GenerateIdServicePort,
  ) {}
  async execute(
    payload: { email: string; password: string },
    queryOauthLogin: IQueryOauthLogin,
  ): Promise<URL> {
    const { oauthRequestId, clientId, scope, redirectUri, state } =
      queryOauthLogin;
    const { email, password } = payload;
    const oauthRequest =
      await this.redisServicePort.consumeOuthRequest(oauthRequestId);

    oauthRequest.requestMatch(queryOauthLogin);

    const userDB = await this.userServicePort.validateUserCredentials({
      email,
      password,
    });

    const code = this.generateIdServicePort.generateOauthAuthorizationCode();
    await this.redisServicePort.saveOauthAuthorizationCode(code, oauthRequest);

    await this.consentServicePort.findOrCreateConsent(
      userDB.id,
      clientId,
      scope,
    );

    return MountUrlValueObject.mount(redirectUri, { code, state });
  }
}
