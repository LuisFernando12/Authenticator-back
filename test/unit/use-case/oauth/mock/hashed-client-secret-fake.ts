import {
  HashedClientSecretServicePort,
  ICompareHashClientSecret,
} from '@/oauth/application/port/hashed-client-secret.port';

export class HashedClientSecretFake implements HashedClientSecretServicePort {
  async compareHashClientSecret(
    _payload: ICompareHashClientSecret,
  ): Promise<void> {
    return;
  }
}
