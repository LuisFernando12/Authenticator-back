import { JwtService } from '@nestjs/jwt';
import { AppConfigEnvService } from '../../../core/domain/service/app-config-env.service';
import { IGenerateToken } from '../../application/interface/generate-token.interface';
import { JwtServicePort } from '../../application/port/jwt-service.port';
import { StringValue } from '../../application/type/string-value.type';
import { TokenDomainError } from '../../domain/error/token-domain.error';

export class JwtServiceAdapter implements JwtServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigEnvService: AppConfigEnvService,
  ) {}

  async signAsync(
    payload: IGenerateToken,
    expiresIn: StringValue,
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn,
        secret: this.appConfigEnvService.secret,
      });
    } catch {
      throw TokenDomainError.internalServerError('Failure to generate token');
    }
  }
  async verifyAsync(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.appConfigEnvService.secret,
      });
    } catch {
      throw TokenDomainError.unauthorized('Invalid token');
    }
  }
}
