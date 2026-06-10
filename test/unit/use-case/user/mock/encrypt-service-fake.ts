import { EncryptServicePort } from '@/user/application/port/encrypt-service.port';

export class EncryptServiceFake implements EncryptServicePort {
  async encrypt(password: string): Promise<string> {
    return `hashed-${password}`;
  }
}
