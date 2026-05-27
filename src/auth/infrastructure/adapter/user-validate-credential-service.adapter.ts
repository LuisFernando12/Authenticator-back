import { compare, genSaltSync, hash } from 'bcrypt';
import { UserValidateCredentialsServicePort } from '../../application/port/user-validate-credentials-service.port';
export class UserValidateCredentialsServiceAdapter implements UserValidateCredentialsServicePort {
  async validate(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
  async encrypt(password: string): Promise<string> {
    return await hash(password, genSaltSync());
  }
}
