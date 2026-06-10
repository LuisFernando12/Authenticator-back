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
  async update({ token, id }: { token: Token; id: string }): Promise<void> {
    const tokenDB = await this.tokenRepository.update({
      id,
      expiresAt: token.expiresAt,
      refreshToken: token.refreshToken,
      jti: token.jti,
    });
    if (!tokenDB || tokenDB.affected === 0) {
      throw TokenDomainError.internalServerError('Error to update token');
    }
    return;
  }
  async findByUserId(userId: string): Promise<Token[]> {
    const tokenDB = await this.tokenRepository.findByUserId(userId);
    if (!tokenDB || tokenDB.length === 0) {
      throw TokenDomainError.notFound('Token not found');
    }
    return tokenDB.map((item) => new Token(item));
  }
  async findByRefreshToken(refreshToken: string): Promise<Token> {
    const tokenDB = await this.tokenRepository.findByRefreshToken(refreshToken);
    if (!tokenDB) {
      throw TokenDomainError.unauthorized('Unauthorized token');
    }
    return new Token(tokenDB);
  }
  async deleteToken(token: string): Promise<void> {
    const tokenDB = await this.tokenRepository.deleteToken(token);
    if (tokenDB.affected === 0) {
      throw TokenDomainError.internalServerError('Error to delete token');
    }
    return;
  }
}
