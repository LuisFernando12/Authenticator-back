import * as bcrypt from 'bcrypt';
import { EncryptServicePort } from '../../application/port/encrypt-service.port';

export class EncryptServiceAdapter implements EncryptServicePort {
  async encrypt(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
