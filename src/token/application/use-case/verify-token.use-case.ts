import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { TokenDomainError } from '../../domain/error/token-domain.error';
import { JwtServicePort } from '../port/jwt-service.port';

export class VerifyTokenUseCase implements BaseUseCase<string> {
  constructor(private readonly jwtServicePort: JwtServicePort) {}
  async execute(token: string): Promise<any> {
    try {
      return await this.jwtServicePort.verifyAsync(token);
    } catch {
      throw TokenDomainError.unauthorized('Invalid token');
    }
  }
}
