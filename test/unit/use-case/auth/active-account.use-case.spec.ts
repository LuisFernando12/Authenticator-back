import { ActiveAccountUseCase } from '@/auth/application/use-case/active-account.use-case';
import { AuthDomainError } from '@/auth/domain/error/auth-domain.error';
import { authMocked, AuthMockedType } from './mock/index.mock';

describe('ActiveAccountUseCase', () => {
  let activeAccountUseCase: ActiveAccountUseCase;
  let authMock: AuthMockedType;

  beforeEach(() => {
    authMock = authMocked();
    activeAccountUseCase = new ActiveAccountUseCase(
      authMock.tokenServiceFake,
      authMock.userRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(activeAccountUseCase).toBeDefined();
  });

  it('should activate an account', async () => {
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

    const result = await activeAccountUseCase.execute('test-token');

    expect(result).toEqual({ message: 'Account activated successfully' });
  });

  it('should throw an error if token is invalid', async () => {
    jest
      .spyOn(authMock.tokenServiceFake, 'verifyToken')
      .mockRejectedValueOnce(AuthDomainError.unauthorized('Invalid token'));

    const promise = activeAccountUseCase.execute('invalid-token');

    await expect(promise).rejects.toThrow('Invalid token');
  });

  it('should throw an error if account is already active', async () => {
    const promise = activeAccountUseCase.execute('test-token');

    await expect(promise).rejects.toThrow('Account already active');
  });

  it('should throw an error if account activation fails', async () => {
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
      .spyOn(authMock.userRepositoryFake, 'activeAccount')
      .mockRejectedValueOnce(
        AuthDomainError.internalServerError('Failure to activate account'),
      );

    const promise = activeAccountUseCase.execute('test-token');

    await expect(promise).rejects.toThrow('Failure to activate account');
  });
});
