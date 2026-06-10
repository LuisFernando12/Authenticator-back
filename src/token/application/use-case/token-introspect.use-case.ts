import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { VerifyTokenUseCase } from './verify-token.use-case';
export interface IResponseTokenIntrospect {
  active: boolean;
  sub: string;
  client_id: string;
  scope: string;
  exp: number;
  iat: number;
  jti: string;
}
export class TokenIntrospectUseCase implements BaseUseCase<string> {
  constructor(private readonly verifyTokenUseCase: VerifyTokenUseCase) {}
  async execute(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }> {
    try {
      const tokenIsValid = await this.verifyTokenUseCase.execute(token);
      return {
        active: true,
        sub: tokenIsValid.sub,
        client_id: tokenIsValid.aud,
        scope: tokenIsValid.scope,
        jti: tokenIsValid.jti,
        exp: tokenIsValid.exp,
        iat: tokenIsValid.iat,
      };
    } catch (_error) {
      return { active: false };
    }
  }
}
