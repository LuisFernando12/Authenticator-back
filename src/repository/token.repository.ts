import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity, TokenEntityType } from 'src/entity/token.entity';
import type { Repository } from 'typeorm';
export interface ITokenRepository {
  create(data: TokenEntityType): any;
  findByUserId(userId: string): Promise<TokenEntity>;
  update(token: string, expiresAt: Date, id: string): any;
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
  async update(token: string, expiresAt: Date, id: string) {
    try {
      return await this.tokenRepository.update({ id }, { token, expiresAt });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
