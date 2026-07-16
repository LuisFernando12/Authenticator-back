import { DeleteByTokenFamilyIdUseCase } from '@/token/application/use-case/delete-by-token-family-id.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('DeleteByTokenFamilyIdUseCase', () => {
  let deleteByTokenFamilyIdUseCase: DeleteByTokenFamilyIdUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    deleteByTokenFamilyIdUseCase = new DeleteByTokenFamilyIdUseCase(
      tokenMock.transactionFake,
    );
  });

  it('should be defined', () => {
    expect(deleteByTokenFamilyIdUseCase).toBeDefined();
  });

  it('should delete all tokens and sessions by token family id', async () => {
    const promise = deleteByTokenFamilyIdUseCase.execute(
      'test-token-family-id',
    );

    await expect(promise).resolves.toBeUndefined();
  });

  it('should throw an error if transaction fails', async () => {
    jest
      .spyOn(tokenMock.transactionFake, 'executeTransaction')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError(
          'Failure to delete token family',
        ),
      );

    const promise = deleteByTokenFamilyIdUseCase.execute(
      'test-token-family-id',
    );

    await expect(promise).rejects.toThrow('Failure to delete token family');
  });
});
