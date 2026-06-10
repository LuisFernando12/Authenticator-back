import { SendNewTokenToEmailActiveUseCase } from '@/auth/application/use-case/send-new-token-to-email-active.use-case';
import { AuthDomainError } from '@/auth/domain/error/auth-domain.error';
import { authMocked, AuthMockedType } from './mock/index.mock';

describe('SendNewTokenToEmailActiveUseCase', () => {
  let sendNewTokenToEmailActiveUseCase: SendNewTokenToEmailActiveUseCase;
  let authMock: AuthMockedType;

  beforeEach(() => {
    authMock = authMocked();
    sendNewTokenToEmailActiveUseCase = new SendNewTokenToEmailActiveUseCase(
      authMock.tokenServiceFake,
      authMock.userRepositoryFake,
      authMock.emailServiceFake,
    );
  });

  it('should be defined', () => {
    expect(sendNewTokenToEmailActiveUseCase).toBeDefined();
  });

  it('should send a new activation email token', async () => {
    jest.spyOn(authMock.userRepositoryFake, 'findByEmail').mockResolvedValueOnce(
      authMock.mockAuthUser({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed-test-password',
        isVerified: false,
        createdAt: new Date(),
      }),
    );

    const result =
      await sendNewTokenToEmailActiveUseCase.execute('john.doe@example.com');

    expect(result).toEqual({ message: 'Email sent successfully' });
  });

  it('should throw an error if the user is not found', async () => {
    jest
      .spyOn(authMock.userRepositoryFake, 'findByEmail')
      .mockRejectedValueOnce(AuthDomainError.notFound('User not found'));

    const promise =
      sendNewTokenToEmailActiveUseCase.execute('invalid@example.com');

    await expect(promise).rejects.toThrow('User not found');
  });

  it('should throw an error if account is already active', async () => {
    const promise =
      sendNewTokenToEmailActiveUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('Account already active');
  });

  it('should throw an error if token generation fails', async () => {
    jest.spyOn(authMock.userRepositoryFake, 'findByEmail').mockResolvedValueOnce(
      authMock.mockAuthUser({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed-test-password',
        isVerified: false,
        createdAt: new Date(),
      }),
    );
    jest
      .spyOn(authMock.tokenServiceFake, 'generateEmailVerificationToken')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to generate token'),
      );

    const promise =
      sendNewTokenToEmailActiveUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('Failure to generate token');
  });

  it('should throw an error if activation email fails', async () => {
    jest.spyOn(authMock.userRepositoryFake, 'findByEmail').mockResolvedValueOnce(
      authMock.mockAuthUser({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed-test-password',
        isVerified: false,
        createdAt: new Date(),
      }),
    );
    jest
      .spyOn(authMock.emailServiceFake, 'sendActivationEmail')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to send email'),
      );

    const promise =
      sendNewTokenToEmailActiveUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('Failure to send email');
  });
});
