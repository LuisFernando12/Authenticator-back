import { AppConfigEnvService } from '../../../core/domain/service/app-config-env.service';
import { ConfigServicePort } from '../../application/port/config-service.port';
import { StringValue } from '../../application/type/string-value.type';

export class ConfigServiceAdapter implements ConfigServicePort {
  constructor(private readonly configService: AppConfigEnvService) {}
  get accessTokenExpiresIn(): StringValue {
    return this.configService.accessTokenExpiresIn as StringValue;
  }
  get refreshTokenExpiresDays(): number {
    return this.configService.refreshTokenExpiresDays;
  }
  get secret(): string {
    return this.configService.secret;
  }
  get emailVerificationTokenExpires(): StringValue {
    return this.configService.emailVerificationTokenExpires as StringValue;
  }
}
