import { ConfigServicePort } from '@/client/application/port/config-service.port';

export class ConfigServiceFake implements ConfigServicePort {
  get clientSecretPepper(): string {
    return 'client-secret-pepper';
  }
}
