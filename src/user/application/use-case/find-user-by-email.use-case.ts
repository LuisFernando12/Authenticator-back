import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { User } from '../../domain/entity/user.entity';
import { UserRepositoryPort } from '../port/user-repository.port';

export class FindUserByEmailUseCase implements BaseUseCase<string, User> {
  constructor(private readonly userRepositoryPort: UserRepositoryPort) {}
  async execute(email: string): Promise<User> {
    const userDB = await this.userRepositoryPort.findByEmail(email);
    userDB.userIsVerified();
    return userDB;
  }
}
