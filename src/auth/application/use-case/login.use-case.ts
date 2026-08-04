import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { SecurityEventType } from '../../../security-event/domain/enum/security-event-type.enum';
import { SeverityType } from '../../../security-event/domain/enum/severity-type.enum';
import { AuthFlow } from '../../domain/enum/auth-flow.enum';
import { AuthDomainError } from '../../domain/error/auth-domain.error';
import { ConfigServicePort } from '../port/config-service.port';
import { RedisServicePort } from '../port/redis-service.port';
import { SecurityEventPort } from '../port/security-event.port';
import { TokenServicePort } from '../port/token-service.port';
import { UserRepositoryPort } from '../port/user-repository.port';
import { UserValidateCredentialsServicePort } from '../port/user-validate-credentials-service.port';
export interface ILoginUseCasePayload {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
}
export interface ILoginUseCaseResponse {
  access_token: string;
  refresh_token: string;
  expiresAt: string;
  redirect_uri: string;
}
export class LoginUseCase implements BaseUseCase<
  ILoginUseCasePayload,
  ILoginUseCaseResponse
> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly userValidateCredentialsServicePort: UserValidateCredentialsServicePort,
    private readonly tokenServicePort: TokenServicePort,
    private readonly configServicePort: ConfigServicePort,
    private readonly securityEventPort: SecurityEventPort,
    private readonly redisServicePort: RedisServicePort,
  ) {}
  private readonly MAX_ATTEMPTS_FAILED = 5;
  async execute(payload: ILoginUseCasePayload): Promise<ILoginUseCaseResponse> {
    try {
      const { email, password } = payload;
      const userDB = await this.userRepositoryPort.findByEmail(email);

      const isMatchedPassword =
        await this.userValidateCredentialsServicePort.validate(
          password,
          userDB.password,
        );
      userDB.passwordMismatch(isMatchedPassword);
      userDB.isVerifiedAccount(AuthFlow.login);

      const token = await this.tokenServicePort.generateToken({
        sub: userDB.id,
        username: userDB.email,
      });

      return {
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
        expiresAt: token.expiresAt,
        redirect_uri: this.configServicePort.redirectURI,
      };
    } catch (error) {
      if (error instanceof AuthDomainError) {
        if (error.status === 401) {
          const failedLoginAttempt =
            await this.redisServicePort.getFailedLoginAttempt(payload.email);
          if (failedLoginAttempt >= this.MAX_ATTEMPTS_FAILED) {
            this.securityEventPort.emit({
              type: SecurityEventType.INVALID_LOGIN_ATTEMPT,
              email: payload.email,
              severity: SeverityType.HIGH,
              ip: payload.ip,
              userAgent: payload.userAgent,
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
