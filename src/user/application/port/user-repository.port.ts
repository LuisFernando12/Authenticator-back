import { User } from './../../domain/entity/user.entity';
export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');
export abstract class UserRepositoryPort {
  abstract existsUser(email: string): Promise<void>;
  abstract create(user: User): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
}
