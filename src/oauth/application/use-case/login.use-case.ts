import { HttpStatus } from '@nestjs/common';
import { SecurityEventType } from '../../../security-event/domain/enum/security-event-type.enum';
import { SeverityType } from '../../../security-event/domain/enum/severity-type.enum';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';
import { MountUrlValueObject } from '../../domain/value-object/mount-url.value-object';
import { GenerateIdServicePort } from '../port/generate-id-service.port';
import { RedisServicePort } from '../port/redis-service-port';
import { SecurityEventPort } from '../port/security-event.port';
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
export interface ILoginUseCasePayload {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
}

export class LoginUseCase {
  constructor(
    private readonly redisServicePort: RedisServicePort,
    private readonly userServicePort: UserServicePort,
    private readonly consentServicePort: ConsentServicePort,
    private readonly generateIdServicePort: GenerateIdServicePort,
    private readonly securityEventPort: SecurityEventPort,
  ) {}
  async execute(
    payload: ILoginUseCasePayload,
    queryOauthLogin: IQueryOauthLogin,
  ): Promise<URL> {
    try {
      const { oauthRequestId, clientId, scope, redirectUri, state } =
        queryOauthLogin;
      const { email, password } = payload;
      const oauthRequest =
        await this.redisServicePort.consumeOauthRequest(oauthRequestId);

      oauthRequest.requestMatch(queryOauthLogin);

      const userDB = await this.userServicePort.validateUserCredentials({
        email,
        password,
      });

      const code = this.generateIdServicePort.generateOauthAuthorizationCode();
      const payloadOauthCodeRedis = {
        userEmail: email,
        codeChallenge: oauthRequest.codeChallenge,
        codeChallengeMethod: oauthRequest.codeChallengeMethod,
        scope: oauthRequest.scope,
      };
      await this.redisServicePort.saveOauthAuthorizationCode(
        code,
        payloadOauthCodeRedis,
      );

      await this.consentServicePort.findOrCreateConsent(
        userDB.id,
        clientId,
        scope,
      );

      return MountUrlValueObject.mount(redirectUri, { code, state });
    } catch (error: any) {
      if (error instanceof OauthDomainError) {
        if (error.status === HttpStatus.FORBIDDEN) {
          const isValidEmail = await this.userServicePort.isValidEmail(
            payload.email,
          );
          const failedLoginAttempt =
            await this.redisServicePort.getFailedLoginAttempt(payload.email);
          if (failedLoginAttempt >= 5) {
            this.securityEventPort.emit({
              ip: payload.ip,
              userAgent: payload.userAgent,
              severity: SeverityType.HIGH,
              type: SecurityEventType.INVALID_OAUTH_LOGIN_ATTEMPT,
              email: payload.email,
              reason: !isValidEmail ? 'USER_NOT_FOUND' : 'INVALID_PASSWORD',
            });
            throw error;
          }
          await this.redisServicePort.setFailedLoginAttempt(payload.email);
        }
      }
      throw error;
    }
  }
}
