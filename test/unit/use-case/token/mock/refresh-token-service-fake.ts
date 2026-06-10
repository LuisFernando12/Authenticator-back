import { RefreshTokenServicePort } from '@/token/application/port/refresh-token-service.port';

export class RefreshTokenServiceFake implements RefreshTokenServicePort {
  generateRefreshToken(): string {
    return 'test-refresh-token';
  }

  hashRefreshToken(refreshToken: string): string {
    return `hashed-${refreshToken}`;
  }
}
