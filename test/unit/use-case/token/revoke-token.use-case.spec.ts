import { RevokeTokenUseCase } from '@/token/application/use-case/revoke-token.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('RevokeTokenUseCase', () => {
  let revokeTokenUseCase: RevokeTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    revokeTokenUseCase = new RevokeTokenUseCase(tokenMock.tokenRepositoryFake);
  });

  it('should be defined', () => {
    expect(revokeTokenUseCase).toBeDefined();
  });

  it('should revoke a token', async () => {
    const result = await revokeTokenUseCase.execute('hashed-refresh-token');

    expect(result).toEqual({ message: 'Token revoked' });
  });

  it('should throw an error if token deletion fails', async () => {
    jest
      .spyOn(tokenMock.tokenRepositoryFake, 'deleteToken')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to revoke token'),
      );

    const promise = revokeTokenUseCase.execute('hashed-refresh-token');

    await expect(promise).rejects.toThrow('Failure to revoke token');
  });
});
