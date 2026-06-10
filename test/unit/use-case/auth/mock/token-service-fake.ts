import {
  IPayloadToken,
  TokenServicePort,
} from '@/auth/application/port/token-service.port';
import { AuthToken } from '@/auth/domain/entity/auth-token.entity';
import { VerifyTokenValueObject } from '@/auth/domain/value-object/verify-token.value-object';

export class TokenServiceFake implements TokenServicePort {
  async generateToken(_payload: IPayloadToken): Promise<AuthToken> {
    return new AuthToken({
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    });
  }

  async verifyToken(_token: string): Promise<VerifyTokenValueObject> {
    return VerifyTokenValueObject.create({
      sub: 'test-user-id',
      username: 'john.doe@example.com',
      type: 'email_verification',
      jti: 'test-jti',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
  }

  async generateEmailVerificationToken(
    _payload: IPayloadToken,
  ): Promise<string> {
    return 'test-email-verification-token';
  }
}
