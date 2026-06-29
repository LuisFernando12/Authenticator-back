import { TokenRepositoryPort } from '../../application/port/token-repository.port';
import { Token } from '../../domain/entity/token.entity';
import { TokenDomainError } from '../../domain/error/token-domain.error';
import { TokenRepository } from '../repository/token.repository';

export class TokenRepositoryAdapter implements TokenRepositoryPort {
  constructor(private readonly tokenRepository: TokenRepository) {}
  async create(token: Token): Promise<Token> {
    const tokenDB = await this.tokenRepository.create(token);
    if (!tokenDB) {
      throw TokenDomainError.internalServerError('Error to create token');
    }
    return new Token(tokenDB);
  }
  async findByTokenFamilyId(tokenFamilyId: string): Promise<Token[]> {
    const tokenDB =
      await this.tokenRepository.findByTokenFamilyId(tokenFamilyId);
    return tokenDB.map((item) => new Token(item)) || [];
  }
  async findByUserId(userId: string): Promise<Token[]> {
    const tokenDB = await this.tokenRepository.findByUserId(userId);
    return tokenDB.map((item) => new Token(item)) || [];
  }
  async findByRefreshToken(refreshToken: string): Promise<Token> {
    const tokenDB = await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!tokenDB) {
      throw TokenDomainError.unauthorized('Unauthorized token');
    }
    return new Token(tokenDB);
  }
  async update({ token, id }: { token: Token; id: string }): Promise<void> {
    await this.tokenRepository.update({
      id,
      token,
    });
    return;
  }
  async deleteToken(token: string): Promise<void> {
    await this.tokenRepository.deleteToken(token);

    return;
  }
  async deleteByTokenFamilyId(tokenFamilyId: string): Promise<void> {
    await this.tokenRepository.deleteByTokenFamilyId(tokenFamilyId);

    return;
  }
}
