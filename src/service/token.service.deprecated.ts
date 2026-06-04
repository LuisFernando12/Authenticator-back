import { AuthLogger } from '@/config/logger/auth-logger.config';
import { TokenRepository } from '@/repository/token.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { TokenEntity } from '../entity/token.entity';
import { AppConfigEnvService } from './app-config-env.service.deprecated';

export interface IResponseTokenIntrospect {
  active: boolean;
  sub: string;
  client_id: string;
  scope: string;
  exp: number;
  iat: number;
  jti: string;
}
export interface IGenerateToken {
  sub: string;
  username: string;
  scope?: string;
  aud?: string;
  iss?: string;
  type?: 'access' | 'email_verification';
}

type StringValue =
  `${number}${'s' | 'sec' | 'm' | 'min' | 'h' | 'd' | 'w' | 'y'}`;
export interface IResponseGenerateToken {
  access_token: string;
  refresh_token: string;
  expiresAt: string;
}
export interface IResponseVerifyToken extends IGenerateToken {
  jti: string;
  iat: number;
  exp: number;
}
export interface ISaveToken {
  token: string;
  refreshToken: string;
  userId: string;
  expiresAt: Date;
  consentId?: string;
  oldRefreshTokenId?: string;
  jti?: string;
}
export interface ITokenService {
  generateToken(
    payload: IGenerateToken,
    consentId?: string,
  ): Promise<IResponseGenerateToken>;
  hashRefreshToken(refreshToken: string): string;
  saveToken({
    token,
    refreshToken,
    userId,
    expiresAt,
    consentId,
    oldRefreshTokenId,
    jti,
  }: ISaveToken): Promise<IResponseGenerateToken>;
  verifyToken(token: string): Promise<IResponseVerifyToken>;
  refreshToken(
    payload: Omit<IGenerateToken, 'type'>,
    token: string,
    consentId?: string,
  ): Promise<IResponseGenerateToken>;
  revokeToken(token: string): Promise<void>;
  tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }>;
  findByRefreshToken(refreshToken: string): Promise<TokenEntity>;
  generateEmailVerificationToken(payload: IGenerateToken): Promise<string>;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private appConfigEnvService: AppConfigEnvService,
    private readonly AuthLogger: AuthLogger,
  ) {}
  private getSecondsByDays(days: number): number {
    return days * (24 * 60 * 60);
  }
  private generateExpireAt(seconds: number): number {
    const expiresAt = new Date(Date.now() + seconds * 1000);
    return Math.floor(expiresAt.valueOf() / 1000);
  }
  private generateRefreshToken() {
    const refreshToken = randomBytes(64).toString('base64url');
    return refreshToken;
  }
  private async generateAccessToken(payload: IGenerateToken): Promise<string> {
    payload['type'] = 'access';
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.appConfigEnvService.accessTokenExpiresIn as StringValue,
      secret: this.appConfigEnvService.secret,
    });
  }
  hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('base64url');
  }
  async saveToken({
    token,
    refreshToken,
    userId,
    expiresAt,
    consentId,
    oldRefreshTokenId,
    jti,
  }: ISaveToken): Promise<IResponseGenerateToken> {
    const payloadToken = {
      refreshToken: this.hashRefreshToken(refreshToken),
      user: { id: userId },
      expiresAt,
      jti,
    };
    if (consentId) {
      payloadToken['consentId'] = consentId;
    }
    if (!oldRefreshTokenId) {
      const tokenSave = await this.tokenRepository.create(payloadToken);
      if (!tokenSave) {
        throw new InternalServerErrorException('Failure to save token');
      }
    }
    if (oldRefreshTokenId) {
      const updateTokenDB = await this.tokenRepository.update({
        id: oldRefreshTokenId,
        ...payloadToken,
      });
      if (!updateTokenDB || updateTokenDB.affected === 0) {
        throw new InternalServerErrorException('Failure to update token');
      }
    }
    return {
      access_token: token,
      refresh_token: refreshToken,
      expiresAt: expiresAt.toISOString(),
    };
  }
  async generateToken(
    payload: IGenerateToken,
    consentId?: string,
  ): Promise<IResponseGenerateToken> {
    const expiresAt = this.generateExpireAt(
      this.getSecondsByDays(this.appConfigEnvService.refreshTokenExpiresDays),
    );
    const jti = randomUUID();
    payload['jti'] = jti;
    const token = await this.generateAccessToken(payload);
    if (!token) {
      throw new InternalServerErrorException('Failure to generate token');
    }

    const refreshToken = this.generateRefreshToken();
    return await this.saveToken({
      token: token,
      refreshToken: refreshToken,
      userId: payload.sub,
      expiresAt: new Date(expiresAt * 1000),
      consentId,
      jti,
    });
  }
  async generateEmailVerificationToken(
    payload: IGenerateToken,
  ): Promise<string> {
    payload['type'] = 'email_verification';
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.appConfigEnvService
        .emailVerificationTokenExpires as StringValue,
      secret: this.appConfigEnvService.secret,
    });
    if (!token) {
      throw new InternalServerErrorException(
        'Failure to generate email verification token',
      );
    }
    return token;
  }
  async verifyToken(token: string): Promise<IResponseVerifyToken> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.appConfigEnvService.secret,
      });
    } catch (_error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
  async refreshToken(
    payload: Omit<IGenerateToken, 'type'>,
    token: string,
    consentId?: string,
  ): Promise<IResponseGenerateToken> {
    const tokenDB = await this.tokenRepository.findByUserId(payload.sub);
    if (!tokenDB || tokenDB.length === 0) {
      throw new NotFoundException('Token not found');
    }
    const refreshTokenDB = tokenDB.find((item) => item.refreshToken === token);
    if (!refreshTokenDB) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const refreshToken = this.generateRefreshToken();
    const jti = randomUUID();
    payload['jti'] = jti;
    const newAccessToken = await this.generateAccessToken(payload);
    if (!newAccessToken) {
      throw new InternalServerErrorException('Failure to generate new token');
    }
    const expireAt = this.generateExpireAt(
      this.getSecondsByDays(this.appConfigEnvService.refreshTokenExpiresDays),
    );
    return this.saveToken({
      token: newAccessToken,
      refreshToken: refreshToken,
      userId: payload.sub,
      expiresAt: new Date(expireAt * 1000),
      consentId,
      oldRefreshTokenId: refreshTokenDB.id,
      jti,
    });
  }
  async revokeToken(token: string): Promise<void> {
    const tokenDelete = await this.tokenRepository.deleteToken(token);
    if (tokenDelete.affected === 0) {
      throw new InternalServerErrorException('Failure to delete token');
    }
  }
  async tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }> {
    try {
      this.AuthLogger.log('Starting method tokenIntrospect', {
        context: 'TokenService method tokenIntrospect',
      });
      const tokenIsValid = await this.verifyToken(token);
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
      this.AuthLogger.error('Invalid token', {
        context: 'TokenService method tokenIntrospect',
      });
      return { active: false };
    }
  }
  async findByRefreshToken(refreshToken: string): Promise<TokenEntity> {
    return await this.tokenRepository.findByRefreshToken(refreshToken);
  }
}
