import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { ConfigServicePort } from '../../application/port/config-service.port';

export class ConfigServiceAdapter implements ConfigServicePort {
  constructor(private readonly configService: AppConfigEnvService) {}
  get oauthLoginURL(): string {
    return this.configService.oauthLoginURL;
  }
  get serviceURL(): string {
    return this.configService.serviceURL;
  }
  get clientSecretPepper(): string {
    return this.configService.clientSecretPepper;
  }
}
