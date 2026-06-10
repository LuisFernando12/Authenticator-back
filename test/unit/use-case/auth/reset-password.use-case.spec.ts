import { ResetPasswordUseCase } from '@/auth/application/use-case/reset-password.use-case';
import { AuthDomainError } from '@/auth/domain/error/auth-domain.error';
import { authMocked, AuthMockedType } from './mock/index.mock';

describe('ResetPasswordUseCase', () => {
  let resetPasswordUseCase: ResetPasswordUseCase;
  let authMock: AuthMockedType;

  beforeEach(() => {
    authMock = authMocked();
    resetPasswordUseCase = new ResetPasswordUseCase(
      authMock.userRepositoryFake,
      authMock.emailServiceFake,
      authMock.redisServiceFake,
      authMock.generateOtpServiceFake,
    );
  });

  it('should be defined', () => {
    expect(resetPasswordUseCase).toBeDefined();
  });

  it('should send recovery email', async () => {
    const result = await resetPasswordUseCase.execute('john.doe@example.com');

    expect(result).toEqual({ message: 'Recovery Email Sent ' });
  });

  it('should throw an error if the user is not found', async () => {
    jest
      .spyOn(authMock.userRepositoryFake, 'findByEmail')
      .mockRejectedValueOnce(AuthDomainError.notFound('User not found'));

    const promise = resetPasswordUseCase.execute('invalid@example.com');

    await expect(promise).rejects.toThrow('User not found');
  });

  it('should throw an error if account is not verified', async () => {
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

    const promise = resetPasswordUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('Account not verified');
  });

  it('should throw an error if it fails to save OTP on Redis', async () => {
    jest
      .spyOn(authMock.redisServiceFake, 'saveResetPasswordCodeOTP')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to save code OTP'),
      );

    const promise = resetPasswordUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('Failure to save code OTP');
  });

  it('should throw an error if reset password email fails', async () => {
    jest
      .spyOn(authMock.emailServiceFake, 'resetPassword')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to send email'),
      );

    const promise = resetPasswordUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('Failure to send email');
  });
});
