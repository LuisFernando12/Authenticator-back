import { ConfigServicePort } from '@/email/application/port/config-service.port';

export class ConfigServiceFake implements ConfigServicePort {
  get serviceVerifyEmailURL(): string {
    return 'https://auth.example.com/active-account';
  }

  get serviceResetPasswordUrl(): string {
    return 'https://auth.example.com/reset-password';
  }
}
