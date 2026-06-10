import { FindByUserIdUseCase } from '@/consent/application/use-case/find-by-user-id.use-case';
import { ConsentDomainError } from '@/consent/domain/error/consent-domain.error';
import { consentMocked, ConsentMockedType } from './mock/index.mock';

describe('FindByUserIdUseCase', () => {
  let findByUserIdUseCase: FindByUserIdUseCase;
  let consentMock: ConsentMockedType;

  beforeEach(() => {
    consentMock = consentMocked();
    findByUserIdUseCase = new FindByUserIdUseCase(
      consentMock.consentRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(findByUserIdUseCase).toBeDefined();
  });

  it('should find consents by user id', async () => {
    const result = await findByUserIdUseCase.execute('test-user-id');

    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe('test-user-id');
  });

  it('should throw an error if consents are not found', async () => {
    jest
      .spyOn(consentMock.consentRepositoryFake, 'findByUserId')
      .mockRejectedValueOnce(ConsentDomainError.notFound('Consents not found'));

    const promise = findByUserIdUseCase.execute('invalid-user-id');

    await expect(promise).rejects.toThrow('Consents not found');
  });
});
