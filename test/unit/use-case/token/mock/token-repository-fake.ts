import { TokenRepositoryPort } from '@/token/application/port/token-repository.port';
import { Token } from '@/token/domain/entity/token.entity';

export class TokenRepositoryFake implements TokenRepositoryPort {
  private token = new Token({
    id: 'test-token-id',
    user: { id: 'test-user-id' },
    jti: 'test-jti',
    consentId: 'test-consent-id',
    tokenFamilyId: 'test-token-family-id',
    refreshToken: 'hashed-old-refresh-token',
    expiresAt: new Date(Date.now() + 3600 * 1000),
  });

  async create(token: Token): Promise<Token> {
    return token;
  }

  async update(_payload: { token: Token; id: string }): Promise<void> {
    return;
  }

  async findByUserId(userId: string): Promise<Token[]> {
    if (userId !== this.token.user.id) {
      return [];
    }

    return [this.token];
  }

  async findByRefreshToken(refreshToken: string): Promise<Token> {
    const refreshTokenExists = [
      this.token.refreshToken,
      'hashed-refresh-token',
    ].includes(refreshToken);

    if (!refreshTokenExists) {
      throw new Error('Token not found');
    }

    return this.token;
  }
  async findByTokenFamilyId(tokenFamilyId: string): Promise<Token[]> {
    if (tokenFamilyId !== this.token.tokenFamilyId) {
      return [];
    }

    return [this.token];
  }

  async deleteToken(_token: string): Promise<void> {
    return;
  }
  async deleteByTokenFamilyId(_tokenFamilyId: string): Promise<void> {
    return Promise.resolve();
  }
}
