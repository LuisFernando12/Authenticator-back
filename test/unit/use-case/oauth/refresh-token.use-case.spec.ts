import { RefreshTokenUseCase } from '@/oauth/application/use-case/refresh-token.use-case';
import { OauthDomainError } from '../../../../src/oauth/domain/error/oauth-domain.error';
import { oauthMocked, OauthMockedType } from './mock/index.mock';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let oauthMock: OauthMockedType;
  beforeEach(() => {
    oauthMock = oauthMocked();
    jest.clearAllMocks();
    jest.resetAllMocks();
    refreshTokenUseCase = new RefreshTokenUseCase(
      oauthMock.tokenServiceFake,
      oauthMock.userServiceFake,
      oauthMock.consentServiceFake,
      oauthMock.configServiceFake,
      oauthMock.redisServiceFake,
    );
  });
  it('should be defined', () => {
    expect(refreshTokenUseCase).toBeDefined();
  });
  it('should return a new token', async () => {
    jest
      .spyOn(
        oauthMock.redisServiceFake,
        'consultHasTokenFamilyOnReuseDetection',
      )
      .mockResolvedValue(null);
    const result = await refreshTokenUseCase.execute({
      grantType: 'refresh_token',
      refreshToken: 'test-refresh-token',
    });
    expect(result.accessToken).toBe('test-access-token');
  });
  it('should throw an error if grant type is invalid', async () => {
    const promise = refreshTokenUseCase.execute({
      grantType: 'invalid_grant',
      refreshToken: 'test-refresh-token',
    });
    await expect(promise).rejects.toThrow('Invalid grant type: invalid_grant');
  });
  it('should throw an error if refresh token is invalid', async () => {
    jest
      .spyOn(
        oauthMock.redisServiceFake,
        'consultHasTokenFamilyOnReuseDetection',
      )
      .mockResolvedValue(null);
    jest
      .spyOn(oauthMock.tokenServiceFake, 'findByRefreshToken')
      .mockRejectedValue(
        OauthDomainError.invalidClient('Invalid refresh token'),
      );
    const promise = refreshTokenUseCase.execute({
      grantType: 'refresh_token',
      refreshToken: 'invalid-refresh-token',
    });
    await expect(promise).rejects.toThrow('Invalid refresh token');
  });
  it('should throw an error if refresh token is expired', async () => {
    jest
      .spyOn(
        oauthMock.redisServiceFake,
        'consultHasTokenFamilyOnReuseDetection',
      )
      .mockResolvedValue(null);

    jest
      .spyOn(oauthMock.tokenServiceFake, 'findByRefreshToken')
      .mockResolvedValue(
        oauthMock.mockOauthToken({
          id: 'test-token-id',
          user: oauthMock.tokenServiceFake.user,
          consent: oauthMock.tokenServiceFake.consent,
          jti: 'test-jti',
          refreshToken: 'test-refresh-token',
          expiresAt: new Date(Date.now() - 24 * (3600 * 1000)),
          consentId: 'test-consent-id',
        } as any),
      );
    const promise = refreshTokenUseCase.execute({
      grantType: 'refresh_token',
      refreshToken: 'expired-refresh-token',
    });
    await expect(promise).rejects.toThrow('Refresh token expired');
  });
  it('should throw an error if reuse detection', async () => {
    jest
      .spyOn(
        oauthMock.redisServiceFake,
        'consultHasTokenFamilyOnReuseDetection',
      )
      .mockResolvedValueOnce({
        tokenFamilyId: 'test-token-family-id',
        jti: 'test-jti',
        refreshToken: 'hashed-old-refresh-token',
        expiresAt: new Date(Date.now() + 3600 * 1000),
      });
    const promise = refreshTokenUseCase.execute({
      grantType: 'refresh_token',
      refreshToken: 'expired-refresh-token',
    });
    await expect(promise).rejects.toThrow(
      'Token family reused, token has already been used!',
    );
  });
});
