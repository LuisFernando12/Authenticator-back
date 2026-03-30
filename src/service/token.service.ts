import { AuthLogger } from '@/config/logger/auth-logger.config';
import { TokenRepository } from '@/repository/token.repository';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';
import { DeleteResult } from 'typeorm';
import { TokenEntity } from '../entity/token.entity';
import { AppConfigEnvService } from './app-config-env.service';

export interface IResponseTokenIntrospect {
  active: boolean;
  sub: string;
  client_id: string;
  scope: string;
  exp: number;
  iat: number;
}

type TypeToken = 'verify-email' | '';
interface IGenerateToken {
  sub: string;
  username: string;
  aud?: string;
  iss?: string;
  scope?: string;
  type?: TypeToken;
}
export interface ITokenService {
  generateToken(payload: IGenerateToken, consentId?: string): Promise<any>;
  hashRefreshToken(refreshToken: string): string;
  saveToken(
    token: string,
    refreshToken: string,
    userId: string,
    expiresAt: Date,
    consentId?: string,
    oldRefreshTokenId?: string,
  ): Promise<any>;
  verifyToken(token: string): Promise<any>;
  decodeToken(token: string): Promise<any>;
  refreshToken(
    payload: Omit<IGenerateToken, 'type'>,
    token: string,
  ): Promise<any>;
  revokeToken(token: string): Promise<any>;
  tokenIntrospect(token: string): Promise<any>;
  findByRefreshToken(refreshToken: string): Promise<TokenEntity>;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private appConfigEnvSevice: AppConfigEnvService,
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
  hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('base64url');
  }
  async saveToken(
    token: string,
    refreshToken: string,
    userId: string,
    expiresAt: Date,
    consentId?: string,
    oldRefreshTokenId?: string,
  ): Promise<any> {
    const payloadToken = {
      refreshToken: this.hashRefreshToken(refreshToken),
      user: { id: userId },
      expiresAt,
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
  ): Promise<
    { access_token: string; refresh_token: string; expiresAt: string } | string
  > {
    const expiresAt = this.generateExpireAt(this.getSecondsByDays(15));
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: `15min`,
      secret: this.appConfigEnvSevice.secret,
    });
    if (!token) {
      throw new InternalServerErrorException('Failure to generate token');
    }
    if (payload.type === 'verify-email') {
      return token;
    }
    const refreshToken = this.generateRefreshToken();
    return await this.saveToken(
      token,
      refreshToken,
      payload.sub,
      new Date(expiresAt * 1000),
      consentId,
    );
  }
  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.appConfigEnvSevice.secret,
      });
    } catch (_error) {
      return false;
    }
  }
  async decodeToken(token: string): Promise<any> {
    return await this.jwtService.decode(token);
  }
  async refreshToken(
    payload: Omit<IGenerateToken, 'type'>,
    token: string,
    consentId?: string,
  ): Promise<any> {
    const tokenDB = await this.tokenRepository.findByUserId(payload.sub);
    if (!tokenDB || tokenDB.length === 0) {
      throw new NotFoundException('Token not found');
    }
    const refreshTokenDB = tokenDB.find((item) => item.refreshToken === token);
    if (!refreshTokenDB) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const refreshToken = this.generateRefreshToken();
    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: `15min`,
      secret: this.appConfigEnvSevice.secret,
    });
    if (!newAccessToken) {
      throw new InternalServerErrorException('Failure to generate new token');
    }
    const expireAt = this.generateExpireAt(this.getSecondsByDays(15));
    return this.saveToken(
      newAccessToken,
      refreshToken,
      payload.sub,
      new Date(expireAt * 1000),
      consentId,
      refreshTokenDB.id,
    );
  }
  async revokeToken(
    token: string,
  ): Promise<DeleteResult & { refreshToken: string }> {
    const tokenDB = await this.tokenRepository.findByRefreshToken(token);
    if (!tokenDB) {
      throw new NotFoundException('Token not found');
    }
    const tokenDelete = await this.tokenRepository.deleteToken(tokenDB);
    if (!tokenDelete.affected) {
      throw new InternalServerErrorException('Failure to delete token');
    }

    return {
      ...tokenDelete,
      refreshToken: tokenDB.refreshToken,
    };
  }
  async tokenIntrospect(
    token: string,
  ): Promise<IResponseTokenIntrospect | { active: boolean }> {
    this.AuthLogger.log('Starting method tokenIntrospect', {
      context: 'TokenService method tokenIntrospect',
    });
    const tokenIsValid = await this.verifyToken(token);
    if (!tokenIsValid) {
      this.AuthLogger.error('Invalid token', {
        context: 'TokenService method tokenIntrospect',
      });
      return { active: false };
    }

    return {
      active: true,
      sub: tokenIsValid.sub,
      client_id: tokenIsValid.aud,
      scope: tokenIsValid.scope,
      exp: tokenIsValid.exp,
      iat: tokenIsValid.iat,
    };
  }
  async findByRefreshToken(refreshToken: string): Promise<TokenEntity> {
    return await this.tokenRepository.findByRefreshToken(refreshToken);
  }
}
