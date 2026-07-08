import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { IGenerateToken } from '../interface/generate-token.interface';
import { ConfigServicePort } from '../port/config-service.port';
import { JwtServicePort } from '../port/jwt-service.port';

export class GenerateEmailVerificationTokenUseCase implements BaseUseCase<
  IGenerateToken,
  string
> {
  constructor(
    private readonly jwtServicePort: JwtServicePort,
    private readonly configServicePort: ConfigServicePort,
  ) {}
  async execute(payload: IGenerateToken): Promise<string> {
    payload['type'] = 'email_verification';
    const token = await this.jwtServicePort.signAsync(
      payload,
      this.configServicePort.emailVerificationTokenExpires,
    );
    return token;
  }
}
