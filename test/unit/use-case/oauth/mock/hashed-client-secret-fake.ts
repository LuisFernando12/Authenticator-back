import {
  HashedClientSecretServicePort,
  ICompareHashClientSecret,
} from '@/oauth/application/port/hashed-client-secret.port';

export class HashedClientSecretFake implements HashedClientSecretServicePort {
  compareHashClientSecret(_payload: ICompareHashClientSecret): void {
    return;
  }
}
