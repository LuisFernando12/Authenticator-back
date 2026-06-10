import { TokenIntrospectUseCase } from '@/token/application/use-case/token-introspect.use-case';
import { VerifyTokenUseCase } from '@/token/application/use-case/verify-token.use-case';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('TokenIntrospectUseCase', () => {
  let tokenIntrospectUseCase: TokenIntrospectUseCase;
  let verifyTokenUseCase: VerifyTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    verifyTokenUseCase = new VerifyTokenUseCase(tokenMock.jwtServiceFake);
    tokenIntrospectUseCase = new TokenIntrospectUseCase(verifyTokenUseCase);
  });

  it('should be defined', () => {
    expect(tokenIntrospectUseCase).toBeDefined();
  });

  it('should return an active token introspection response', async () => {
    const result = await tokenIntrospectUseCase.execute('test-token');

    expect(result).toEqual({
      active: true,
      sub: 'test-user-id',
      client_id: 'test-client-id',
      scope: 'read write',
      jti: 'test-jti',
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('should return inactive if token is invalid', async () => {
    jest
      .spyOn(tokenMock.jwtServiceFake, 'verifyAsync')
      .mockRejectedValueOnce(new Error('Invalid token'));

    const result = await tokenIntrospectUseCase.execute('invalid-token');

    expect(result).toEqual({ active: false });
  });
});
