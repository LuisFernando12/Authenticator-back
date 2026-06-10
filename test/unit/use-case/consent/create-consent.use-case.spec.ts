import { CreateConsentUseCase } from '@/consent/application/use-case/create-consent.use-case';
import { ConsentDomainError } from '@/consent/domain/error/consent-domain.error';
import { consentMocked, ConsentMockedType } from './mock/index.mock';

describe('CreateConsentUseCase', () => {
  let createConsentUseCase: CreateConsentUseCase;
  let consentMock: ConsentMockedType;

  beforeEach(() => {
    consentMock = consentMocked();
    createConsentUseCase = new CreateConsentUseCase(
      consentMock.consentRepositoryFake,
    );
  });

  const consent = () =>
    consentMock.mockConsent({
      scopes: ['read', 'write'],
      userId: 'test-user-id',
      clientId: 'test-client-id',
      grantedAt: new Date(),
      expiresAt: null,
      revokeAt: null,
    });

  it('should be defined', () => {
    expect(createConsentUseCase).toBeDefined();
  });

  it('should create a consent', async () => {
    const result = await createConsentUseCase.execute(consent());

    expect(result).toBeUndefined();
  });

  it('should throw an error if consent creation fails', async () => {
    jest
      .spyOn(consentMock.consentRepositoryFake, 'create')
      .mockRejectedValueOnce(
        ConsentDomainError.internalServerError(
          'Failure to create user client consent',
        ),
      );

    const promise = createConsentUseCase.execute(consent());

    await expect(promise).rejects.toThrow(
      'Failure to create user client consent',
    );
  });
});
