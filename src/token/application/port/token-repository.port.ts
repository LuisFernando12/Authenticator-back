import { Token } from '../../domain/entity/token.entity';

export const TOKEN_REPOSITORY_PORT = Symbol('TOKEN_REPOSITORY_PORT');

export abstract class TokenRepositoryPort {
  abstract create(token: Token): Promise<Token>;
  abstract update({ token, id }: { token: Token; id: string }): Promise<void>;
  abstract findByUserId(userId: string): Promise<Token[]>;
  abstract findByRefreshToken(refreshToken: string): Promise<Token>;
  abstract findByTokenFamilyId(tokenFamilyId: string): Promise<Token[]>;
  abstract deleteToken(token: string): Promise<void>;
  abstract deleteByTokenFamilyId(tokenFamilyId: string): Promise<void>;
}
