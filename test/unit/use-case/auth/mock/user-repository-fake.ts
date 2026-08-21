import { UserRepositoryPort } from '@/auth/application/port/user-repository.port';
import { AuthUser } from '@/auth/domain/entity/auth-user.entity';

export class UserRepositoryFake implements UserRepositoryPort {
  private readonly user = new AuthUser({
    id: 'test-user-id',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed-test-password',
    isVerified: true,
    createdAt: new Date(),
  });

  async findByEmail(email: string): Promise<AuthUser> {
    if (email !== this.user.email) {
      throw new Error('User not found');
    }

    return this.user;
  }

  async activeAccount(_email: string): Promise<boolean> {
    return true;
  }

  async updatePassword(_email: string, _password: string): Promise<void> {
    return;
  }
  emailExists(email: string): Promise<boolean> {
    if (email === this.user.email) {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}
