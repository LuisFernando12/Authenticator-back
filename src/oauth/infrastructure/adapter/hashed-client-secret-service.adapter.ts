import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import {
  HashedClientSecretServicePort,
  ICompareHashClientSecret,
} from '@/oauth/application/port/hashed-client-secret.port';
import * as bcrypt from 'bcrypt';
export class HashedClientSecretServiceAdapter implements HashedClientSecretServicePort {
  constructor(private readonly appConfigEnvService: AppConfigEnvService) {}
  compareHashClientSecret({
    clientSecret,
    clientSecretHashed,
    clientSecretPepper,
  }: ICompareHashClientSecret): void {
    if (
      !bcrypt.compareSync(clientSecret + clientSecretPepper, clientSecretHashed)
    ) {
      throw new Error('Invalid client secret !');
    }
  }
}
