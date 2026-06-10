import {
  HashedClientSecretServicePort,
  ICompareHashClientSecret,
} from '@/oauth/application/port/hashed-client-secret.port';
import * as bcrypt from 'bcrypt';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';
export class HashedClientSecretServiceAdapter implements HashedClientSecretServicePort {
  async compareHashClientSecret({
    clientSecret,
    clientSecretHashed,
    clientSecretPepper,
  }: ICompareHashClientSecret): Promise<void> {
    if (
      !(await bcrypt.compare(
        clientSecret + clientSecretPepper,
        clientSecretHashed,
      ))
    ) {
      throw OauthDomainError.invalidClient('Invalid client secret !');
    }
  }
}
