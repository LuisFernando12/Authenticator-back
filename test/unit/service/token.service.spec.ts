import { InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import {
  ITokenRepository,
  TokenRepository,
} from '../../../src/repository/token.repository';
import { AppConfigEnvService } from '../../../src/service/app-config-env.service';
import {
  ITokenService,
  TokenService,
} from '../../../src/service/token.service';

describe('TokenService', () => {
  let tokenService: ITokenService;
  const mockTokenRepository: ITokenRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
  };
  const mockAppconfigEnvService = {
    secret: 'secret',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: TokenRepository,
          useValue: mockTokenRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: AppConfigEnvService,
          useValue: mockAppconfigEnvService,
        },
      ],
    }).compile();
    tokenService = module.get<TokenService>(TokenService);
  });
  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });
  describe('generateToken', () => {
    const payload = {
      sub: '1',
      username: 'john.doe@example.com',
    };
    it('should generate a object token with payload', async () => {
      mockJwtService.signAsync = jest.fn().mockResolvedValueOnce('token');
      tokenService.saveToken = jest.fn().mockResolvedValueOnce({
        access_token: 'token',
        expiresAt: '2023-01-01T00:00:00.000Z',
      });
      const result = await tokenService.generateToken(payload);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload);
      expect(result).toEqual({
        access_token: 'token',
        expiresAt: '2023-01-01T00:00:00.000Z',
      });
    });
    it('should generate a string token with payload', async () => {
      payload['type'] = 'verify-email';
      mockJwtService.signAsync = jest.fn().mockResolvedValueOnce('token');
      const result = await tokenService.generateToken(payload);
      expect(result).toBe('token');
    });
    it('should throw an error to generate a token', async () => {
      mockJwtService.signAsync = jest.fn().mockRejectedValueOnce(null);
      try {
        await tokenService.generateToken(payload);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('saveToken', () => {
    const data = {
      token: 'token',
      userId: '1',
      expiresAt: new Date('2023-01-01T00:00:00.000Z'),
    };
    it('should save a token', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(null);
      mockTokenRepository.create = jest.fn().mockResolvedValueOnce(data);
      const result = await tokenService.saveToken(
        data.token,
        data.userId,
        data.expiresAt,
      );
      expect(mockTokenRepository.findByUserId).toHaveBeenCalledWith(
        data.userId,
      );
      expect(mockTokenRepository.create).toHaveBeenCalledWith({
        token: data.token,
        user: { id: data.userId },
        expiresAt: data.expiresAt,
      });
      expect(result).toEqual({
        access_token: data.token,
        expiresAt: data.expiresAt.toISOString(),
      });
    });
    it('should update a token', async () => {
      data['id'] = '01';
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(data);
      mockTokenRepository.update = jest.fn().mockResolvedValueOnce({
        affected: 1,
      });
      const result = await tokenService.saveToken(
        data.token,
        data.userId,
        data.expiresAt,
      );
      expect(result).toEqual({
        access_token: data.token,
        expiresAt: data.expiresAt.toISOString(),
      });
    });
    it('should throw an error to update a token', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(data);
      mockTokenRepository.update = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });
      try {
        await tokenService.saveToken('kvmdfkbm', data.userId, data.expiresAt);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to update token');
        }
      }
    });
  });
  describe('verifyToken', () => {
    const token = 'token';
    it('should verify a token', async () => {
      mockJwtService.verifyAsync = jest.fn().mockResolvedValueOnce(true);
      const result = await tokenService.verifyToken(token);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: mockAppconfigEnvService.secret,
      });
      expect(result).toBe(true);
    });
    it('should return false to verify a token', async () => {
      mockJwtService.verifyAsync = jest.fn().mockResolvedValueOnce(false);
      const result = await tokenService.verifyToken(token);
      expect(result).toBe(false);
    });
    it('should throw an error to verify a token', async () => {
      mockJwtService.verifyAsync = jest.fn().mockRejectedValueOnce(null);
      try {
        await tokenService.verifyToken(token);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('decodeToken', () => {
    const token = 'token';
    it('should decode a token', async () => {
      mockJwtService.decode = jest.fn().mockResolvedValueOnce({
        sub: '1',
        username: 'john.doe@example.com',
      });
      const result = await tokenService.decodeToken(token);
      expect(mockJwtService.decode).toHaveBeenCalledWith(token);
      expect(result).toEqual({
        sub: '1',
        username: 'john.doe@example.com',
      });
    });
  });
});
