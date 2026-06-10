import { RefreshTokenUseCase } from '@/token/application/use-case/refresh-token.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    refreshTokenUseCase = new RefreshTokenUseCase(
      tokenMock.tokenRepositoryFake,
      tokenMock.configServiceFake,
      tokenMock.jwtServiceFake,
      tokenMock.refreshTokenServiceFake,
      tokenMock.generateJtiFake,
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
    oldRefreshToken: 'hashed-old-refresh-token',
  };

  it('should be defined', () => {
    expect(refreshTokenUseCase).toBeDefined();
  });

  it('should refresh a token', async () => {
    const result = await refreshTokenUseCase.execute(payload);

    expect(result.access_token).toBe('test-access-token');
    expect(result.refresh_token).toBe('test-refresh-token');
    expect(result.expiresAt).toBeDefined();
  });

  it('should throw an error if refresh token is invalid', async () => {
    const promise = refreshTokenUseCase.execute({
      ...payload,
      oldRefreshToken: 'invalid-refresh-token',
    });

    await expect(promise).rejects.toThrow('Invalid refresh token');
  });

  it('should throw an error if refresh token is expired', async () => {
    jest.spyOn(tokenMock.tokenRepositoryFake, 'findByUserId').mockResolvedValueOnce([
      tokenMock.mockToken({
        id: 'test-token-id',
        user: { id: 'test-user-id' },
        jti: 'test-jti',
        consentId: 'test-consent-id',
        refreshToken: 'hashed-old-refresh-token',
        expiresAt: new Date(Date.now() - 3600 * 1000),
      }),
    ]);

    const promise = refreshTokenUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Token expired');
  });

  it('should throw an error if access token generation fails', async () => {
    jest
      .spyOn(tokenMock.jwtServiceFake, 'signAsync')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to generate token'),
      );

    const promise = refreshTokenUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to generate token');
  });

  it('should throw an error if token update fails', async () => {
    jest
      .spyOn(tokenMock.tokenRepositoryFake, 'update')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to update token'),
      );

    const promise = refreshTokenUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to update token');
  });
});
