import { TokenRepository } from '@/repository/token.repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AppConfigEnvService } from './app-config-env.service';

type TypeToken = 'verify-email' | '';

export interface ITokenService {
  generateToken(payload: {
    sub: string;
    username: string;
    aud?: string;
    iss?: string;
    scope?: string;
    type?: TypeToken;
  }): Promise<any>;
  saveToken(
    token: string,
    refreshToken: string,
    userId: string,
    expiresAt: Date,
  ): Promise<any>;
  verifyToken(token: string): Promise<any>;
  decodeToken(token: string): Promise<any>;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private appConfigEnvSevice: AppConfigEnvService,
  ) {}
  private generateExpireAt(seconds: number = 900): number {
    const expiresAt = new Date(Date.now() + seconds * 1000);
    return Math.floor(expiresAt.valueOf() / 1000);
  }
  async saveToken(
    token: string,
    refreshToken: string,
    userId: string,
    expiresAt: Date,
  ): Promise<any> {
    const tokenDB = await this.tokenRepository.findByUserId(userId);
    if (!tokenDB) {
      const tokenSave = await this.tokenRepository.create({
        token,
        refreshToken,
        user: { id: userId },
        expiresAt: new Date(expiresAt),
      });
      return {
        access_token: tokenSave.token,
        refresh_token: tokenSave.refreshToken,
        expiresAt: expiresAt.toISOString(),
      };
    } else {
      const payloadTokenUpdate = {
        id: tokenDB.id,
        token,
        expiresAt: new Date(expiresAt),
      };

      payloadTokenUpdate['refreshToken'] = refreshToken;

      const tokenUpdate = await this.tokenRepository.update(payloadTokenUpdate);
      if (!tokenUpdate.affected) {
        throw new InternalServerErrorException('Failure to update token');
      }
      return {
        access_token: token,
        refresh_token: refreshToken,
        expiresAt: expiresAt.toISOString(),
      };
    }
  }
  async generateToken(payload: {
    sub: string;
    username: string;
    aud?: string;
    iss?: string;
    scope?: string;
    type?: TypeToken;
  }): Promise<
    { access_token: string; refresh_token: string; expiresAt: string } | string
  > {
    const expiresAt = this.generateExpireAt();
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
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: `15d`,
      secret: this.appConfigEnvSevice.secret,
    });
    if (!refreshToken) {
      throw new InternalServerErrorException(
        'Failure to generate refresh token',
      );
    }
    return await this.saveToken(
      token,
      refreshToken,
      payload.sub,
      new Date(expiresAt * 1000),
    );
  }
  async verifyToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.appConfigEnvSevice.secret,
      });
    } catch (error) {
      return false;
    }
  }
  async decodeToken(token: string): Promise<any> {
    return await this.jwtService.decode(token);
  }
}
