import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from 'src/repository/token.repository';

type TypeToken = 'verify-email' | '';

export interface ITokenService {
  generateToken(payload: { sub: string; username: string }): Promise<any>;
  saveToken(token: string, userId: string, expiresAt: Date): Promise<any>;
  verifyToken(token: string): Promise<any>;
}

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
  ) {}
  private generateExpireAt(): number {
    const date = new Date();
    const expireAt = date.setSeconds(date.getSeconds() + 60);
    return expireAt;
  }
  async saveToken(
    token: string,
    userId: string,
    expiresAt: Date,
  ): Promise<any> {
    const tokenDB = await this.tokenRepository.findByUserId(userId);
    if (!tokenDB) {
      const tokenSave = await this.tokenRepository.create({
        token,
        user: { id: userId },
        expiresAt: new Date(expiresAt),
      });
      return {
        access_token: tokenSave.token,
        expiresAt: expiresAt.toISOString(),
      };
    } else {
      const tokenUpdate = await this.tokenRepository.update(
        token,
        expiresAt,
        tokenDB.id,
      );
      if (!tokenUpdate.affected) {
        throw new InternalServerErrorException('Failure to update token');
      }
      return {
        access_token: token,
        expiresAt: expiresAt.toISOString(),
      };
    }
  }
  async generateToken(payload: {
    sub: string;
    username: string;
    type?: TypeToken;
  }): Promise<string> {
    const expiresAt = this.generateExpireAt();
    const token = await this.jwtService.signAsync(payload);
    if (payload.type === 'verify-email') {
      return await this.saveToken(token, payload.sub, new Date(expiresAt));
    }
    return await this.saveToken(token, payload.sub, new Date(expiresAt));
  }

  async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
