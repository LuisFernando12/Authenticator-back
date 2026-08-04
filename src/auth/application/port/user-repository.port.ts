import { AuthUser } from '../../domain/entity/auth-user.entity';

export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

export abstract class UserRepositoryPort {
  abstract findByEmail(email: string): Promise<AuthUser>;
  abstract activeAccount(email: string): Promise<boolean>;
  abstract updatePassword(email: string, password: string): Promise<void>;
  abstract emailExists(email: string): Promise<boolean>;
}
