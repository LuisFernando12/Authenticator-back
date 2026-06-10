import { IGenerateToken } from '@/token/application/interface/generate-token.interface';
import { JwtServicePort } from '@/token/application/port/jwt-service.port';
import { StringValue } from '@/token/application/type/string-value.type';

export class JwtServiceFake implements JwtServicePort {
  async signAsync(
    _payload: IGenerateToken & { jti?: string },
    _expiresIn: StringValue,
  ): Promise<string> {
    return 'test-access-token';
  }

  async verifyAsync(_token: string): Promise<any> {
    return {
      sub: 'test-user-id',
      username: 'john.doe@example.com',
      aud: 'test-client-id',
      scope: 'read write',
      jti: 'test-jti',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };
  }
}
