import { GenerateEmailVerificationTokenUseCase } from '@/token/application/use-case/generate-email-verification-token.use-case';
import { TokenDomainError } from '@/token/domain/error/token-domain.error';
import { tokenMocked, TokenMockedType } from './mock/index.mock';

describe('GenerateEmailVerificationTokenUseCase', () => {
  let generateEmailVerificationTokenUseCase: GenerateEmailVerificationTokenUseCase;
  let tokenMock: TokenMockedType;

  beforeEach(() => {
    tokenMock = tokenMocked();
    generateEmailVerificationTokenUseCase =
      new GenerateEmailVerificationTokenUseCase(
        tokenMock.jwtServiceFake,
        tokenMock.configServiceFake,
      );
  });

  const payload = {
    sub: 'test-user-id',
    username: 'john.doe@example.com',
  };

  it('should be defined', () => {
    expect(generateEmailVerificationTokenUseCase).toBeDefined();
  });

  it('should generate an email verification token', async () => {
    const result = await generateEmailVerificationTokenUseCase.execute(payload);

    expect(result).toBe('test-access-token');
  });

  it('should throw an error if token generation fails', async () => {
    jest
      .spyOn(tokenMock.jwtServiceFake, 'signAsync')
      .mockRejectedValueOnce(
        TokenDomainError.internalServerError('Failure to generate token'),
      );

    const promise = generateEmailVerificationTokenUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to generate token');
  });
});
