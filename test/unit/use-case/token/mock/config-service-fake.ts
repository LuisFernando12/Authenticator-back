import { ConfigServicePort } from '@/token/application/port/config-service.port';
import { StringValue } from '@/token/application/type/string-value.type';

export class ConfigServiceFake implements ConfigServicePort {
  get accessTokenExpiresIn(): StringValue {
    return '15m';
  }

  get refreshTokenExpiresDays(): number {
    return 7;
  }

  get secret(): string {
    return 'test-secret';
  }

  get emailVerificationTokenExpires(): StringValue {
    return '1h';
  }
}
