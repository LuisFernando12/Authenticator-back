import { GenerateTokenUseCase } from '@/token/application/use-case/generate-token.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('GenerateTokenUseCase', () => {
  let generateTokenUseCase: GenerateTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    generateTokenUseCase = new GenerateTokenUseCase(
      tokenMock.tokenRepositoryFake,
      tokenMock.configServiceFake,
      tokenMock.jwtServiceFake,
      tokenMock.refreshTokenServiceFake,
      tokenMock.generateJtiFake,
      tokenMock.transactionFake,
    );
  });

  const payload = {
    payload: {
      sub: 'test-user-id',
      username: 'john.doe@example.com',
      scope: 'read write',
      aud: 'test-client-id',
      iss: 'https://auth.example.com',
    },
    consentId: 'test-consent-id',
  };

  it('should be defined', () => {
    expect(generateTokenUseCase).toBeDefined();
  });

  it('should generate a token', async () => {
    const result = await generateTokenUseCase.execute(payload);

    expect(result.access_token).toBe('test-access-token');
    expect(result.refresh_token).toBe('test-refresh-token');
    expect(result.expiresAt).toBeDefined();
  });
  it('should generate a token without consent', async () => {
    const result = await generateTokenUseCase.execute({
      ...payload,
      consentId: null,
    });

    expect(result.access_token).toBe('test-access-token');
    expect(result.refresh_token).toBe('test-refresh-token');
    expect(result.expiresAt).toBeDefined();
  });

  it('should reuse token family when consent already has a token', async () => {
    const signAsyncSpy = jest.spyOn(tokenMock.jwtServiceFake, 'signAsync');

    await generateTokenUseCase.execute(payload);

    expect(signAsyncSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenFamilyId: 'test-token-family-id',
      }),
      expect.any(String),
    );
  });

  it('should generate a new token family when consent has no token yet', async () => {
    const signAsyncSpy = jest.spyOn(tokenMock.jwtServiceFake, 'signAsync');

    await generateTokenUseCase.execute({
      ...payload,
      consentId: 'new-consent-id',
    });

    expect(signAsyncSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        tokenFamilyId: 'test-jti',
      }),
      expect.any(String),
    );
  });

  it('should throw an error if access token generation fails', async () => {
    jest
      .spyOn(tokenMock.jwtServiceFake, 'signAsync')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to generate token'),
      );

    const promise = generateTokenUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to generate token');
  });

  it('should throw an error if token persistence fails', async () => {
    jest
      .spyOn(tokenMock.transactionFake, 'executeTransaction')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to save token'),
      );

    const promise = generateTokenUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to save token');
  });
});
