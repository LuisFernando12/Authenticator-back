import { RevokeTokenUseCase } from '@/oauth/application/use-case/revoke-token.use-case';
import { oauthMocked, OauthMockedType } from './mock/index.mock';

describe('RevokeTokenUseCase', () => {
  let revokeTokenUseCase: RevokeTokenUseCase;
  let oauthMock: OauthMockedType;
  beforeEach(() => {
    oauthMock = oauthMocked();
    jest.clearAllMocks();
    revokeTokenUseCase = new RevokeTokenUseCase(
      oauthMock.tokenServiceFake,
      oauthMock.redisServiceFake,
    );
  });
  it('should be defined', () => {
    expect(revokeTokenUseCase).toBeDefined();
  });
  it('should revoke a refresh token', async () => {
    const result = await revokeTokenUseCase.execute('test-refresh-token');
    expect(result).toEqual({ message: 'Token revoked successfully' });
  });
  it('should throw an error if the refresh token is invalid', async () => {
    jest
      .spyOn(oauthMock.tokenServiceFake, 'findByRefreshToken')
      .mockResolvedValueOnce(
        oauthMock.mockOauthToken({
          id: 'test-token-id',
          user: oauthMock.tokenServiceFake.user,
          consent: oauthMock.tokenServiceFake.consent,
          refreshToken: 'test-refresh-token',
          jti: 'test-jti',
          expiresAt: new Date(Date.now() - 24 * (3600 * 1000)),
          consentId: 'test-consent-id',
        } as any),
      );
    const promise = revokeTokenUseCase.execute('invalid-refresh-token');
    await expect(promise).rejects.toThrow('Refresh token expired');
  });
});
