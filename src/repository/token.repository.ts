import { TokenEntity, TokenEntityType } from '@/entity/token.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { DeleteResult, Repository } from 'typeorm';
export interface ITokenRepository {
  create(data: TokenEntityType): any;
  findByUserId(userId: string): Promise<TokenEntity[]>;
  update({ id, expiresAt, refreshToken, jti }: ITokenUpdate): any;
  findByRefreshToken(token: string): Promise<TokenEntity>;
  deleteToken(token: string): Promise<DeleteResult>;
}
interface ITokenUpdate {
  expiresAt: Date;
  id: string;
  refreshToken?: string;
  jti: string;
}
@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}
  async create(data: TokenEntityType) {
    try {
      return await this.tokenRepository.save(data);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findByUserId(userId: string): Promise<TokenEntity[]> {
    try {
      return await this.tokenRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update({ id, expiresAt, refreshToken, jti }: ITokenUpdate) {
    try {
      return await this.tokenRepository.update(
        { id },
        { expiresAt, refreshToken, jti },
      );
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findByRefreshToken(token: string): Promise<TokenEntity> {
    try {
      return this.tokenRepository.findOne({
        where: {
          refreshToken: token,
        },
        relations: {
          user: true,
        },
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async deleteToken(refreshToken: string): Promise<DeleteResult> {
    try {
      return await this.tokenRepository.delete({
        refreshToken: refreshToken,
      });
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
