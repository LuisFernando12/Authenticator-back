import { createHash, randomBytes } from 'node:crypto';
import { RefreshTokenServicePort } from '../../application/port/refresh-token-service.port';

export class RefreshTokenServiceAdapter implements RefreshTokenServicePort {
  generateRefreshToken(): string {
    const refreshToken = randomBytes(64).toString('base64url');
    return refreshToken;
  }
  hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('base64url');
  }
}
