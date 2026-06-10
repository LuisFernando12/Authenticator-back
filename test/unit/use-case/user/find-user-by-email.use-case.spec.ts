import { FindUserByEmailUseCase } from '@/user/application/use-case/find-user-by-email.use-case';
import { UserDomainError } from '@/user/domain/error/user-domain.error';
import { userMocked, UserMockedType } from './mock/index.mock';

describe('FindUserByEmailUseCase', () => {
  let findUserByEmailUseCase: FindUserByEmailUseCase;
  let userMock: UserMockedType;

  beforeEach(() => {
    userMock = userMocked();
    findUserByEmailUseCase = new FindUserByEmailUseCase(
      userMock.userRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(findUserByEmailUseCase).toBeDefined();
  });

  it('should return a verified user', async () => {
    const result = await findUserByEmailUseCase.execute('john.doe@example.com');

    expect(result.email).toBe('john.doe@example.com');
    expect(result.isVerified).toBe(true);
  });

  it('should throw an error if the user is not found', async () => {
    jest
      .spyOn(userMock.userRepositoryFake, 'findByEmail')
      .mockRejectedValueOnce(UserDomainError.notFound('User not found'));

    const promise = findUserByEmailUseCase.execute('invalid@example.com');

    await expect(promise).rejects.toThrow('User not found');
  });

  it('should throw an error if the user is not verified', async () => {
    jest.spyOn(userMock.userRepositoryFake, 'findByEmail').mockResolvedValueOnce(
      userMock.mockUser({
        id: 'test-user-id',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashed-test-password',
        isVerified: false,
        createdAt: new Date(),
      }),
    );

    const promise = findUserByEmailUseCase.execute('john.doe@example.com');

    await expect(promise).rejects.toThrow('User not verified');
  });
});
