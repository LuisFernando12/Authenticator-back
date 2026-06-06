import { Token } from '../../domain/entity/token.entity';
import { IGenerateToken } from '../interface/generate-token.interface';
import { FindByRefreshTokenUseCase } from '../use-case/find-by-refresh-token.use-case';
import { GenerateEmailVerificationTokenUseCase } from '../use-case/generate-email-verification-token.use-case';
import {
  GenerateTokenUseCase,
  IGenerateTokenPayload,
  IResponseGenerateToken,
} from '../use-case/generate-token.use-case';
import {
  IRefreshTokenPayload,
  RefreshTokenUseCase,
} from '../use-case/refresh-token.use-case';
import { RevokeTokenUseCase } from '../use-case/revoke-token.use-case';
import {
  IResponseTokenIntrospect,
  TokenIntrospectUseCase,
} from '../use-case/token-introspect.use-case';
import { VerifyTokenUseCase } from '../use-case/verify-token.use-case';
export abstract class ITokenService {
  abstract generate({
    payload,
    consentId,
  }: IGenerateTokenPayload): Promise<IResponseGenerateToken>;
  abstract refreshToken({
    payload,
    oldRefreshToken,
  }: IRefreshTokenPayload): Promise<IResponseGenerateToken>;
  abstract revoke(token: string): Promise<{ message: string }>;
  abstract tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }>;
  abstract verify(token: string): Promise<any>;
  abstract findByRefreshToken(token: string): Promise<Token>;
  abstract generateEmailVerificationToken(
    payload: IGenerateToken,
  ): Promise<string>;
}
export class TokenService implements ITokenService {
  constructor(
    private readonly generateTokenUseCase: GenerateTokenUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly revokeTokenUseCase: RevokeTokenUseCase,
    private readonly tokenIntrospectUseCase: TokenIntrospectUseCase,
    private readonly verifyTokenUseCase: VerifyTokenUseCase,
    private readonly findByRefreshTokenUseCase: FindByRefreshTokenUseCase,
    private readonly generateEmailVerificationTokenUseCase: GenerateEmailVerificationTokenUseCase,
  ) {}
  async generate({
    payload,
    consentId,
  }: IGenerateTokenPayload): Promise<IResponseGenerateToken> {
    return await this.generateTokenUseCase.execute({
      payload,
      consentId: consentId || null,
    });
  }
  async refreshToken({
    payload,
    oldRefreshToken,
  }: IRefreshTokenPayload): Promise<IResponseGenerateToken> {
    return await this.refreshTokenUseCase.execute({ payload, oldRefreshToken });
  }
  async revoke(token: string): Promise<{ message: string }> {
    return await this.revokeTokenUseCase.execute(token);
  }
  async tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }> {
    return await this.tokenIntrospectUseCase.execute(token);
  }
  async verify(token: string): Promise<any> {
    return await this.verifyTokenUseCase.execute(token);
  }
  async findByRefreshToken(token: string): Promise<Token> {
    return await this.findByRefreshTokenUseCase.execute(token);
  }
  async generateEmailVerificationToken(
    payload: IGenerateToken,
  ): Promise<string> {
    return await this.generateEmailVerificationTokenUseCase.execute(payload);
  }
}
