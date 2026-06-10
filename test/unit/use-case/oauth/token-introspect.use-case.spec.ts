import { TokenIntrospectUseCase } from '@/oauth/application/use-case/token-introspect.use-case';
import { oauthMocked, OauthMockedType } from './mock/index.mock';

describe('TokenIntrospectUseCase', () => {
  let tokenIntrospectUseCase: TokenIntrospectUseCase;
  let oauthMock: OauthMockedType;
  beforeEach(() => {
    oauthMock = oauthMocked();
    tokenIntrospectUseCase = new TokenIntrospectUseCase(
      oauthMock.tokenServiceFake,
      oauthMock.redisServiceFake,
    );
  });
  it('should be defined', () => {
    expect(tokenIntrospectUseCase).toBeDefined();
  });
  it('should return true if the token is active', async () => {
    const result = await tokenIntrospectUseCase.execute('test-access-token');
    expect(result).toEqual({
      active: true,
      scope: 'read write',
      client_id: 'test-client-id',
      username: 'test-user',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
  });
  it('should return false if the token is not active', async () => {
    const result = await tokenIntrospectUseCase.execute('invalid-access-token');
    expect(result).toEqual({ active: false });
  });
  it('should return false if the token is on block list', async () => {
    jest
      .spyOn(oauthMock.redisServiceFake, 'consultHasJtiTokenOnBlockList')
      .mockResolvedValueOnce(true);
    const result = await tokenIntrospectUseCase.execute('test-access-token');
    expect(result).toEqual({ active: false });
  });
});
