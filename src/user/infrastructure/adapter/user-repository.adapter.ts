import { UserRepositoryPort } from '../../application/port/user-repository.port';
import { User } from '../../domain/entity/user.entity';
import { UserDomainError } from '../../domain/error/user-domain.error';
import { UserRepository } from '../persistence/repository/user.repository';

export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly userRepository: UserRepository) {}
  async existsUser(email: string): Promise<void> {
    if (await this.userRepository.existsUser(email)) {
      throw UserDomainError.conflict('User already exists');
    }
  }
  async create(user: User): Promise<User> {
    const userDB = await this.userRepository.create(user);
    if (!userDB) {
      throw UserDomainError.internalServerError('failed user register');
    }
    return new User({
      id: userDB.id,
      name: userDB.name,
      email: userDB.email,
      password: userDB.password,
      isVerified: userDB.isVerified,
      createdAt: userDB.createdAt,
    });
  }
  async findByEmail(email: string): Promise<User> {
    const userDB = await this.userRepository.findByEmail(email);
    if (!userDB) {
      throw UserDomainError.notFound('User not found');
    }
    return userDB;
  }
}
