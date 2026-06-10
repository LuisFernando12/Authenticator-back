import { VerifyTokenUseCase } from '@/token/application/use-case/verify-token.use-case';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('VerifyTokenUseCase', () => {
  let verifyTokenUseCase: VerifyTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    verifyTokenUseCase = new VerifyTokenUseCase(tokenMock.jwtServiceFake);
  });

  it('should be defined', () => {
    expect(verifyTokenUseCase).toBeDefined();
  });

  it('should verify a token', async () => {
    const result = await verifyTokenUseCase.execute('test-token');

    expect(result.sub).toBe('test-user-id');
    expect(result.username).toBe('john.doe@example.com');
  });

  it('should throw an error if token is invalid', async () => {
    jest
      .spyOn(tokenMock.jwtServiceFake, 'verifyAsync')
      .mockRejectedValueOnce(new Error('Invalid token'));

    const promise = verifyTokenUseCase.execute('invalid-token');

    await expect(promise).rejects.toThrow('Invalid token');
  });
});
