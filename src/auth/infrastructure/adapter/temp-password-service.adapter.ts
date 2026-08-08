import { genSalt, hash } from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { TempPasswordServicePort } from '../../application/port/temp-password.port';
export class TempPasswordServiceAdapter implements TempPasswordServicePort {
  password(): string {
    const randomPassword = randomBytes(8).toString('hex');
    return randomPassword;
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }
}
