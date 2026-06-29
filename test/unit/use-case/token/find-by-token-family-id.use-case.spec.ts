import { FindByTokenFamilyIdUseCase } from '@/token/application/use-case/find-by-token-family-id.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('FindByTokenFamilyIdUseCase', () => {
  let findByTokenFamilyIdUseCase: FindByTokenFamilyIdUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    findByTokenFamilyIdUseCase = new FindByTokenFamilyIdUseCase(
      tokenMock.tokenRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(findByTokenFamilyIdUseCase).toBeDefined();
  });

  it('should find tokens by token family id', async () => {
    const result = await findByTokenFamilyIdUseCase.execute(
      'test-token-family-id',
    );

    expect(result).toHaveLength(1);
    expect(result[0].tokenFamilyId).toBe('test-token-family-id');
  });

  it('should return an empty list when token family does not exist', async () => {
    const result = await findByTokenFamilyIdUseCase.execute(
      'invalid-token-family-id',
    );

    expect(result).toEqual([]);
  });

  it('should throw an error if repository fails', async () => {
    jest
      .spyOn(tokenMock.tokenRepositoryFake, 'findByTokenFamilyId')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to find token family'),
      );

    const promise = findByTokenFamilyIdUseCase.execute(
      'test-token-family-id',
    );

    await expect(promise).rejects.toThrow('Failure to find token family');
  });
});
