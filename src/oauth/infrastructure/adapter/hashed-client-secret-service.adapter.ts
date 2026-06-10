import {
  HashedClientSecretServicePort,
  ICompareHashClientSecret,
} from '@/oauth/application/port/hashed-client-secret.port';
import * as bcrypt from 'bcrypt';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';
export class HashedClientSecretServiceAdapter implements HashedClientSecretServicePort {
  compareHashClientSecret({
    clientSecret,
    clientSecretHashed,
    clientSecretPepper,
  }: ICompareHashClientSecret): void {
    if (
      !bcrypt.compare(clientSecret + clientSecretPepper, clientSecretHashed)
    ) {
      throw OauthDomainError.invalidClient('Invalid client secret !');
    }
  }
}
