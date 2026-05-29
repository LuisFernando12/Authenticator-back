import { ConfigServicePort } from '@/client/application/port/config-service.port';
import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';

export class ConfigServiceAdapter implements ConfigServicePort {
  constructor(private readonly appConfigEnvService: AppConfigEnvService) {}
  get clientSecretPepper(): string {
    return this.appConfigEnvService.clientSecretPepper;
  }
}
