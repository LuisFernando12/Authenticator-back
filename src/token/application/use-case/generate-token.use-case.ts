import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { Token } from '../../domain/entity/token.entity';
import { TokenValueObject } from '../../domain/value-object/token.value-object';
import { IGenerateToken } from '../interface/generate-token.interface';
import { ConfigServicePort } from '../port/config-service.port';
import { GenerateJtiPort } from '../port/generate-jti.port';
import { JwtServicePort } from '../port/jwt-service.port';
import { RefreshTokenServicePort } from '../port/refresh-token-service.port';
import { TokenRepositoryPort } from '../port/token-repository.port';

export interface IGenerateTokenPayload {
  payload: IGenerateToken;
  consentId?: string;
}
export interface IResponseGenerateToken {
  access_token: string;
  refresh_token: string;
  expiresAt: string;
}
export class GenerateTokenUseCase implements BaseUseCase<IGenerateTokenPayload> {
  constructor(
    private readonly tokenRepositoryPort: TokenRepositoryPort,
    private readonly configServicePort: ConfigServicePort,
    private readonly jwtServicePort: JwtServicePort,
    private readonly refreshTokenServicePort: RefreshTokenServicePort,
    private readonly generateJtiPort: GenerateJtiPort,
  ) {}
  async execute({
    payload,
    consentId,
  }: IGenerateTokenPayload): Promise<IResponseGenerateToken> {
    const expiresAtInMilliseconds = TokenValueObject.generateExpireAt(
      TokenValueObject.getSecondsByDays(
        this.configServicePort.refreshTokenExpiresDays,
      ),
    );
    const expiresAt = new Date(expiresAtInMilliseconds * 1000);
    const jti = this.generateJtiPort.generate();
    payload['jti'] = jti;
    const token = await this.jwtServicePort.signAsync(
      payload,
      this.configServicePort.accessTokenExpiresIn,
    );

    const refreshToken = this.refreshTokenServicePort.generateRefreshToken();

    const tokenEntity = new Token({
      refreshToken: this.refreshTokenServicePort.hashRefreshToken(refreshToken),
      user: { id: payload.sub },
      expiresAt: expiresAt,
      consentId: consentId || null,
      jti,
    });

    await this.tokenRepositoryPort.create(tokenEntity);
    return {
      access_token: token,
      refresh_token: refreshToken,
      expiresAt: expiresAt.toISOString(),
    };
  }
}
