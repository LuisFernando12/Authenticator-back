import { ConfigServicePort } from '@/auth/application/port/config-service.port';

export class ConfigServiceFake implements ConfigServicePort {
  get redirectURI(): string {
    return 'https://example.com/callback';
  }
}
