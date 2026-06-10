import { UserValidateCredentialsServicePort } from '@/auth/application/port/user-validate-credentials-service.port';

export class UserValidateCredentialsServiceFake
  implements UserValidateCredentialsServicePort
{
  async validate(_password: string, _hash: string): Promise<boolean> {
    return true;
  }

  async encrypt(password: string): Promise<string> {
    return `hashed-${password}`;
  }
}
