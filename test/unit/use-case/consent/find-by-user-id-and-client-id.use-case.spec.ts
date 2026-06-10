import { FindByUserIdAndClientIdUseCase } from '@/consent/application/use-case/find-by-user-id-and-client-id.use-case';
import { ConsentDomainError } from '@/consent/domain/error/consent-domain.error';
import { consentMocked, ConsentMockedType } from './mock/index.mock';

describe('FindByUserIdAndClientIdUseCase', () => {
  let findByUserIdAndClientIdUseCase: FindByUserIdAndClientIdUseCase;
  let consentMock: ConsentMockedType;

  beforeEach(() => {
    consentMock = consentMocked();
    findByUserIdAndClientIdUseCase = new FindByUserIdAndClientIdUseCase(
      consentMock.consentRepositoryFake,
    );
  });

  const payload = {
    userId: 'test-user-id',
    clientId: 'test-client-id',
  };

  it('should be defined', () => {
    expect(findByUserIdAndClientIdUseCase).toBeDefined();
  });

  it('should find a consent by user id and client id', async () => {
    const result = await findByUserIdAndClientIdUseCase.execute(payload);

    expect(result.userId).toBe('test-user-id');
    expect(result.clientId).toBe('test-client-id');
  });

  it('should return null if consent is not found', async () => {
    const result = await findByUserIdAndClientIdUseCase.execute({
      userId: 'invalid-user-id',
      clientId: 'test-client-id',
    });

    expect(result).toBeNull();
  });

  it('should throw an error if consent lookup fails', async () => {
    jest
      .spyOn(consentMock.consentRepositoryFake, 'findByUserIdAndClientId')
      .mockRejectedValueOnce(
        ConsentDomainError.internalServerError('Failure to find consent'),
      );

    const promise = findByUserIdAndClientIdUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to find consent');
  });
});
