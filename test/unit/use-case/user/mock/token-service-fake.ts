import {
  IGenerateEmailVerificationToken,
  TokenServicePort,
} from '@/user/application/port/token-service.port';

export class TokenServiceFake implements TokenServicePort {
  async generateEmailVerificationToken(
    _payload: IGenerateEmailVerificationToken,
  ): Promise<string> {
    return 'test-email-verification-token';
  }
}
