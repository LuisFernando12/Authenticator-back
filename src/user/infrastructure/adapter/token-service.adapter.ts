import { TokenService } from '../../../service/token.service';
import {
  IGenerateEmailVerificationToken,
  TokenServicePort,
} from '../../application/port/token-service.port';
import { UserDomainError } from '../../domain/error/user-domain.error';

export class TokenServiceAdapter implements TokenServicePort {
  constructor(private readonly tokenService: TokenService) {}
  async generateEmailVerificationToken(
    payload: IGenerateEmailVerificationToken,
  ): Promise<string> {
    try {
      const verification_token =
        await this.tokenService.generateEmailVerificationToken({
          sub: payload.sub,
          username: payload.username,
        });

      if (!verification_token) {
        throw UserDomainError.internalServerError('Failure to generate token');
      }

      return verification_token;
    } catch (_error) {
      throw UserDomainError.internalServerError();
    }
  }
}
