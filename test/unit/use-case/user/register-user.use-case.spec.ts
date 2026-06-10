import { RegisterUserUseCase } from '@/user/application/use-case/register-user.use-case';
import { UserDomainError } from '@/user/domain/error/user-domain.error';
import { userMocked, UserMockedType } from './mock/index.mock';

describe('RegisterUserUseCase', () => {
  let registerUserUseCase: RegisterUserUseCase;
  let userMock: UserMockedType;

  beforeEach(() => {
    userMock = userMocked();
    registerUserUseCase = new RegisterUserUseCase(
      userMock.userRepositoryFake,
      userMock.encryptServiceFake,
      userMock.emailServiceFake,
      userMock.tokenServiceFake,
    );
  });

  const payload = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'test-password',
  };

  it('should be defined', () => {
    expect(registerUserUseCase).toBeDefined();
  });

  it('should register a user', async () => {
    const result = await registerUserUseCase.execute(payload);

    expect(result).toEqual({
      message: 'User created. Please verify your email to account active!',
    });
  });

  it('should return a fallback message if the email was not sent', async () => {
    jest
      .spyOn(userMock.emailServiceFake, 'sendActivationEmail')
      .mockResolvedValueOnce('FAILED');

    const result = await registerUserUseCase.execute(payload);

    expect(result).toEqual({
      message:
        'User created. Please verify your email to account active, if you have not received the email request it again!',
    });
  });

  it('should throw an error if the user already exists', async () => {
    jest
      .spyOn(userMock.userRepositoryFake, 'existsUser')
      .mockRejectedValueOnce(UserDomainError.conflict('User already exists'));

    const promise = registerUserUseCase.execute(payload);

    await expect(promise).rejects.toThrow('User already exists');
  });

  it('should throw an error if password encryption fails', async () => {
    jest
      .spyOn(userMock.encryptServiceFake, 'encrypt')
      .mockRejectedValueOnce(
        UserDomainError.internalServerError('Failure to encrypt password'),
      );

    const promise = registerUserUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to encrypt password');
  });

  it('should throw an error if user creation fails', async () => {
    jest
      .spyOn(userMock.userRepositoryFake, 'create')
      .mockRejectedValueOnce(
        UserDomainError.internalServerError('failed user register'),
      );

    const promise = registerUserUseCase.execute(payload);

    await expect(promise).rejects.toThrow('failed user register');
  });

  it('should throw an error if token generation fails', async () => {
    jest
      .spyOn(userMock.tokenServiceFake, 'generateEmailVerificationToken')
      .mockRejectedValueOnce(
        UserDomainError.internalServerError('Failure to generate token'),
      );

    const promise = registerUserUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to generate token');
  });

  it('should throw an error if activation email fails', async () => {
    jest
      .spyOn(userMock.emailServiceFake, 'sendActivationEmail')
      .mockRejectedValueOnce(
        UserDomainError.internalServerError('Failure to send email'),
      );

    const promise = registerUserUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to send email');
  });
});
