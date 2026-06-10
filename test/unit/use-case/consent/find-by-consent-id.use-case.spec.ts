import { FindByConsentIdUseCase } from '@/consent/application/use-case/find-by-consent-id.use-case';
import { ConsentDomainError } from '@/consent/domain/error/consent-domain.error';
import { consentMocked, ConsentMockedType } from './mock/index.mock';

describe('FindByConsentIdUseCase', () => {
  let findByConsentIdUseCase: FindByConsentIdUseCase;
  let consentMock: ConsentMockedType;

  beforeEach(() => {
    consentMock = consentMocked();
    findByConsentIdUseCase = new FindByConsentIdUseCase(
      consentMock.consentRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(findByConsentIdUseCase).toBeDefined();
  });

  it('should find a consent by id', async () => {
    const result = await findByConsentIdUseCase.execute('test-consent-id');

    expect(result.id).toBe('test-consent-id');
    expect(result.userId).toBe('test-user-id');
    expect(result.clientId).toBe('test-client-id');
  });

  it('should throw an error if consent id is invalid', async () => {
    jest
      .spyOn(consentMock.consentRepositoryFake, 'findByConsentId')
      .mockRejectedValueOnce(ConsentDomainError.badRequest('Invalid param'));

    const promise = findByConsentIdUseCase.execute('');

    await expect(promise).rejects.toThrow('Invalid param');
  });

  it('should throw an error if consent is not found', async () => {
    jest
      .spyOn(consentMock.consentRepositoryFake, 'findByConsentId')
      .mockRejectedValueOnce(ConsentDomainError.notFound('Consent not found'));

    const promise = findByConsentIdUseCase.execute('invalid-consent-id');

    await expect(promise).rejects.toThrow('Consent not found');
  });
});
