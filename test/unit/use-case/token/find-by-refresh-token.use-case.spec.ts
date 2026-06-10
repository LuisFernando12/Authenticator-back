import { FindByRefreshTokenUseCase } from '@/token/application/use-case/find-by-refresh-token.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('FindByRefreshTokenUseCase', () => {
  let findByRefreshTokenUseCase: FindByRefreshTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    findByRefreshTokenUseCase = new FindByRefreshTokenUseCase(
      tokenMock.tokenRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(findByRefreshTokenUseCase).toBeDefined();
  });

  it('should find a token by refresh token', async () => {
    const result = await findByRefreshTokenUseCase.execute(
      'hashed-old-refresh-token',
    );

    expect(result.refreshToken).toBe('hashed-old-refresh-token');
  });

  it('should throw an error if token is not found', async () => {
    jest
      .spyOn(tokenMock.tokenRepositoryFake, 'findByRefreshToken')
      .mockRejectedValueOnce(TokenDomainError.notFound('Token not found'));

    const promise = findByRefreshTokenUseCase.execute('invalid-refresh-token');

    await expect(promise).rejects.toThrow('Token not found');
  });
});
