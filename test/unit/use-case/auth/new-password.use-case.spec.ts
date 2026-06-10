import { NewPasswordUseCase } from '@/auth/application/use-case/new-password.use-case';
import { AuthDomainError } from '@/auth/domain/error/auth-domain.error';
import { authMocked, AuthMockedType } from './mock/index.mock';

describe('NewPasswordUseCase', () => {
  let newPasswordUseCase: NewPasswordUseCase;
  let authMock: AuthMockedType;

  beforeEach(() => {
    authMock = authMocked();
    newPasswordUseCase = new NewPasswordUseCase(
      authMock.redisServiceFake,
      authMock.userRepositoryFake,
      authMock.userValidateCredentialsServiceFake,
    );
  });

  const payload = {
    password: 'new-password',
    code: 123456,
  };

  it('should be defined', () => {
    expect(newPasswordUseCase).toBeDefined();
  });

  it('should update password', async () => {
    jest
      .spyOn(authMock.userValidateCredentialsServiceFake, 'validate')
      .mockResolvedValueOnce(false);

    const result = await newPasswordUseCase.execute(payload);

    expect(result).toEqual({ message: 'Updated password' });
  });

  it('should throw an error if OTP is invalid', async () => {
    jest
      .spyOn(authMock.redisServiceFake, 'consumeResetPasswordCodeOTP')
      .mockRejectedValueOnce(AuthDomainError.badRequest('Invalid code !'));

    const promise = newPasswordUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Invalid code !');
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

    const promise = newPasswordUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Account not verified');
  });

  it('should throw an error if password was already used', async () => {
    const promise = newPasswordUseCase.execute(payload);

    await expect(promise).rejects.toThrow(
      'Password already used, please try again with another password!',
    );
  });

  it('should throw an error if password encryption fails', async () => {
    jest
      .spyOn(authMock.userValidateCredentialsServiceFake, 'validate')
      .mockResolvedValueOnce(false);
    jest
      .spyOn(authMock.userValidateCredentialsServiceFake, 'encrypt')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to encrypt password'),
      );

    const promise = newPasswordUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to encrypt password');
  });

  it('should throw an error if password update fails', async () => {
    jest
      .spyOn(authMock.userValidateCredentialsServiceFake, 'validate')
      .mockResolvedValueOnce(false);
    jest
      .spyOn(authMock.userRepositoryFake, 'updatePassword')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to update password'),
      );

    const promise = newPasswordUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to update password');
  });

  it('should throw an error if clearing OTP fails', async () => {
    jest
      .spyOn(authMock.userValidateCredentialsServiceFake, 'validate')
      .mockResolvedValueOnce(false);
    jest
      .spyOn(authMock.redisServiceFake, 'clearResetPasswordCodeOTP')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to clear code OTP'),
      );

    const promise = newPasswordUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to clear code OTP');
  });
});
