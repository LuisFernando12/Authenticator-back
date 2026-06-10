import { UserRepositoryPort } from '@/user/application/port/user-repository.port';
import { User } from '@/user/domain/entity/user.entity';

export class UserRepositoryFake implements UserRepositoryPort {
  private user = new User({
    id: 'test-user-id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed-test-password',
    isVerified: true,
    createdAt: new Date(),
  });

  async existsUser(_email: string): Promise<void> {
    return;
  }

  async create(user: User): Promise<User> {
    return new User({
      id: 'test-user-id',
      name: user.name,
      email: user.email,
      password: user.password,
      isVerified: false,
      createdAt: new Date(),
    });
  }

  async findByEmail(email: string): Promise<User> {
    if (email !== this.user.email) {
      throw new Error('User not found');
    }

    return this.user;
  }
}
