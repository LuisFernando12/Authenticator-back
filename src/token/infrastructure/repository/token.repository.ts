import { TokenEntity } from '@/token/infrastructure/persistence/entity/token.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { Token } from '../../domain/entity/token.entity';
import { TokenDomainError } from '../../domain/error/token-domain.error';
export interface ITokenRepository {
  create(data: Token): Promise<Token>;
  findByUserId(userId: string): Promise<Token[]>;
  findByRefreshToken(token: string): Promise<Token>;
  findByTokenFamilyId(tokenFamilyId: string): Promise<Token[]>;
  update({ id, token }: ITokenUpdate): Promise<void>;
  deleteByTokenFamilyId(tokenFamilyId: string): Promise<void>;
  deleteToken(token: string): Promise<void>;
}
interface ITokenUpdate {
  id: string;
  token: Token;
}
@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
  ) {}
  async create(data: Token): Promise<Token> {
    try {
      const token = await this.tokenRepository.save(data.toJSON());
      return new Token(token);
    } catch (error: any) {
      throw TokenDomainError.internalServerError(error.message);
    }
  }
  async findByUserId(userId: string): Promise<Token[]> {
    try {
      const tokenDB = await this.tokenRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
      return tokenDB.map((token) => new Token(token)) || [];
    } catch (error: any) {
      throw TokenDomainError.internalServerError(error.message);
    }
  }
  async update({
    id,
    token: { expiresAt, refreshToken, jti },
  }: ITokenUpdate): Promise<void> {
    try {
      const token = await this.tokenRepository.update(
        { id: id },
        { expiresAt, refreshToken, jti },
      );
      if (token.affected === 0) {
        throw TokenDomainError.unauthorized('Unauthorized token');
      }
      return;
    } catch (error: any) {
      if (error.status === 401) throw error;
      throw TokenDomainError.internalServerError(error.message);
    }
  }
  async findByRefreshToken(token: string): Promise<Token> {
    try {
      const tokenDB = await this.tokenRepository.findOne({
        where: {
          refreshToken: token,
        },
        relations: {
          user: true,
          consent: true,
        },
      });
      return new Token(tokenDB);
    } catch (error: any) {
      throw TokenDomainError.internalServerError(error.message);
    }
  }
  async findByTokenFamilyId(tokenFamilyId: string): Promise<Token[]> {
    try {
      const tokenDB = await this.tokenRepository.find({
        where: {
          tokenFamilyId: tokenFamilyId,
        },
      });
      return tokenDB.map((token) => new Token(token)) || [];
    } catch (error: any) {
      throw TokenDomainError.internalServerError(error.message);
    }
  }
  async deleteToken(refreshToken: string): Promise<void> {
    try {
      const tokenDelete = await this.tokenRepository.delete({
        refreshToken: refreshToken,
      });
      if (tokenDelete.affected === 0) {
        throw TokenDomainError.unauthorized('Unauthorized token');
      }
    } catch (error: any) {
      throw TokenDomainError.internalServerError(error.message);
    }
  }
  async deleteByTokenFamilyId(tokenFamilyId: string): Promise<void> {
    try {
      await this.tokenRepository.softDelete({
        tokenFamilyId: tokenFamilyId,
      });
    } catch (error: any) {
      throw TokenDomainError.internalServerError(error.message);
    }
  }
}
