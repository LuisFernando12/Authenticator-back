import { ConfigServicePort } from '@/oauth/application/port/config-service.port';

export class ConfigServiceFake implements ConfigServicePort {
  get serviceURL(): string {
    return 'https://service.com';
  }
  get clientSecretPepper(): string {
    return 'test-client-secret-pepper';
  }
  get oauthLoginURL(): string {
    return 'https://auth.com/oauth/login';
  }
}
