import { TokenEntity, TokenEntityType } from '@/entity/token.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
export interface ITokenRepository {
  create(data: TokenEntityType): any;
  findByUserId(userId: string): Promise<TokenEntity>;
  update({ id, token, expiresAt, refreshToken }: ITokenUpdate): any;
}
interface ITokenUpdate {
  token: string;
  expiresAt: Date;
  id: string;
  refreshToken?: string;
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
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async findByUserId(userId: string): Promise<TokenEntity> {
    try {
      return await this.tokenRepository.findOne({
        where: {
          user: {
            id: userId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async update({ id, token, expiresAt, refreshToken }: ITokenUpdate) {
    try {
      return await this.tokenRepository.update(
        { id },
        { token, expiresAt, refreshToken },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
