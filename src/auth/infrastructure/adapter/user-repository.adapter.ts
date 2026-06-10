import { IUserRepository } from '@/user/infrastructure/repository/user.repository';
import { UserRepositoryPort } from '../../application/port/user-repository.port';
import { AuthUser } from '../../domain/entity/auth-user.entity';
import { AuthDomainError } from '../../domain/error/auth-domain.error';

export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly userRepository: IUserRepository) {}
  async findByEmail(email: string): Promise<AuthUser> {
    const userDB = await this.userRepository.findByEmail(email);
    if (!userDB) {
      throw AuthDomainError.notFound('User not found');
    }
    return new AuthUser(userDB);
  }
  async activeAccount(email: string): Promise<boolean> {
    const accountActive = await this.userRepository.activeAccount(email);
    if (!accountActive) {
      throw AuthDomainError.internalServerError('Failure to activate account');
    }
    return true;
  }
  async updatePassword(email: string, password: string): Promise<void> {
    const passwordUpdate = await this.userRepository.updatePassword(
      email,
      password,
    );
    if (!passwordUpdate) {
      throw AuthDomainError.internalServerError('Failure to update password');
    }
    return;
  }
}
