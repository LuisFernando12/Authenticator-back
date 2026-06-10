import { AppConfigEnvService } from '@/core/domain/service/app-config-env.service';
import { ConfigServicePort } from '../../application/port/config-service.port';

export class ConfigServiceAdapter implements ConfigServicePort {
  constructor(private readonly appConfigEnvService: AppConfigEnvService) {}
  get redirectURI(): string {
    return this.appConfigEnvService.redirectURI;
  }
}
