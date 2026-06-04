import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthLogger } from '../../../src/config/logger/auth-logger.config';
import {
  ITokenRepository,
  TokenRepository,
} from '../../../src/repository/token.repository';
import { AppConfigEnvService } from '../../../src/service/app-config-env.service.deprecated';
import {
  ITokenService,
  TokenService,
} from '../../../src/service/token.service.deprecated';
import { mockAppconfigEnvService } from '../mock/appConfigEnv.mock';
import { mockAuthLogger } from '../mock/logger.mock';
import { mockTokenService } from '../mock/token.mock';

describe('TokenService', () => {
  let tokenService: ITokenService;
  const mockTokenRepository: ITokenRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    deleteToken: jest.fn(),
    findByRefreshToken: jest.fn(),
  };
  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
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
        {
          provide: AuthLogger,
          useValue: mockAuthLogger,
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
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValueOnce('token');
      tokenService.saveToken = jest.fn().mockResolvedValueOnce({
        access_token: 'token',
        refresh_token: 'refreshToken',
        expiresAt: '2023-01-01T00:00:00.000Z',
      });
      const result = await tokenService.generateToken(payload);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: mockAppconfigEnvService.secret,
        expiresIn: '15min',
      });
      expect(result).toEqual({
        access_token: 'token',
        expiresAt: '2023-01-01T00:00:00.000Z',
        refresh_token: 'refreshToken',
      });
    });
    it('should throw an error to generate a token', async () => {
      mockJwtService.signAsync = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.generateToken(payload);
      await expect(promise).rejects.toThrow(InternalServerErrorException);
      await expect(promise).rejects.toThrow('Failure to generate token');
    });
  });
  describe('generateEmailVerificationToken', () => {
    const payload = {
      sub: '1',
      username: 'john.doe@example.com',
    };
    it('should generate a object token with payload', async () => {
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValueOnce('token');
      tokenService.saveToken = jest.fn().mockResolvedValueOnce({
        access_token: 'token',
        refresh_token: 'refreshToken',
        expiresAt: '2023-01-01T00:00:00.000Z',
      });
      const result = await tokenService.generateEmailVerificationToken(payload);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(payload, {
        secret: mockAppconfigEnvService.secret,
        expiresIn: mockAppconfigEnvService.emailVerificationTokenExpires,
      });
      expect(result).toEqual('token');
    });
    it('should throw an error to generate a token', async () => {
      mockJwtService.signAsync = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.generateEmailVerificationToken(payload);
      await expect(promise).rejects.toThrow(InternalServerErrorException);
      await expect(promise).rejects.toThrow(
        'Failure to generate email verification token',
      );
    });
  });
  describe('saveToken', () => {
    const data = {
      token: 'token',
      refreshToken: 'refreshToken',
      userId: '1',
      expiresAt: new Date('2023-01-01T00:00:00.000Z'),
      consentId: 'consentId',
      jti: 'jti-01',
    };
    const payload = {
      refreshToken: data.refreshToken,
      user: { id: data.userId },
      expiresAt: data.expiresAt,
      consentId: data.consentId,
    };
    it('should save a token with consentId', async () => {
      mockTokenRepository.create = jest.fn().mockResolvedValueOnce(payload);
      const result = await tokenService.saveToken(data);
      expect(mockTokenRepository.create).toHaveBeenCalledWith({
        refreshToken: mockTokenService.hashRefreshToken(data.refreshToken),
        user: { id: data.userId },
        expiresAt: data.expiresAt,
        consentId: data.consentId,
        jti: data.jti,
      });
      expect(result).toEqual({
        access_token: 'token',
        refresh_token: 'refreshToken',
        expiresAt: data.expiresAt.toISOString(),
      });
    });
    it('should update a token when has a oldRefreshToken', async () => {
      mockTokenRepository.update = jest.fn().mockResolvedValueOnce({
        affected: 1,
      });
      const result = await tokenService.saveToken({
        ...data,
        oldRefreshTokenId: 'oldRefreshTokenId',
      });
      expect(result).toEqual({
        access_token: data.token,
        refresh_token: data.refreshToken,
        expiresAt: data.expiresAt.toISOString(),
      });
    });
    it('should throw an error to save token with failure to save token', async () => {
      mockTokenRepository.create = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.saveToken(data);
      await expect(promise).rejects.toBeInstanceOf(
        InternalServerErrorException,
      );
      await expect(promise).rejects.toThrow('Failure to save token');
    });
    it('should throw an error to update a token with affected 0 on update', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(data);
      mockTokenRepository.update = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });
      const promise = tokenService.saveToken({
        ...data,
        oldRefreshTokenId: 'oldRefreshTokenId',
      });
      await expect(promise).rejects.toThrow('Failure to update token');
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });
    it('should throw an error to update a token with other failure like null or undefined', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(data);
      mockTokenRepository.update = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.saveToken({
        ...data,
        oldRefreshTokenId: 'oldRefreshTokenId',
      });
      await expect(promise).rejects.toThrow('Failure to update token');
      await expect(promise).rejects.toThrow(InternalServerErrorException);
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
      const promise = tokenService.verifyToken(token);
      await expect(promise).rejects.toBeInstanceOf(UnauthorizedException);
      await expect(promise).rejects.toThrow('Invalid token');
    });
  });
  describe('refreshToken', () => {
    const tokenResult = [
      {
        id: '1',
        userId: 'userId-01',
        token: 'token',
        refreshToken: 'refreshToken',
        expiresAt: mockTokenService.generateExpireAt(),
      },
      {
        id: '2',
        userId: 'userId-02',
        token: 'token2',
        refreshToken: 'refreshToken2',
        expiresAt: mockTokenService.generateExpireAt(),
      },
    ];
    const mockPayload = {
      sub: 'sub-01',
      username: 'jondoe@example.com',
      aud: 'clientId-01',
      iss: 'www.exemple.api.com',
      scope: 'scope1 scope2',
    };
    it('should be refresh a token', async () => {
      mockTokenRepository.findByUserId = jest
        .fn()
        .mockResolvedValueOnce(tokenResult);
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValueOnce('newToken');
      mockTokenRepository.update = jest.fn().mockResolvedValueOnce({
        affected: 1,
      });

      const result = await tokenService.refreshToken(
        mockPayload,
        'refreshToken',
      );
      const totalSecoundsToAllDays = mockTokenService.getSecondByDays();
      const expiresAt = Math.floor(
        new Date(Date.now() + totalSecoundsToAllDays * 1000).valueOf() / 1000,
      );

      expect(result).toEqual({
        access_token: 'newToken',
        expiresAt: new Date(expiresAt * 1000).toISOString(),
        refresh_token: expect.any(String),
      });
    });
    it('should throw an error to refresh token with Token not found ', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.refreshToken(mockPayload, 'refreshToken');
      await expect(promise).rejects.toThrow('Token not found');
      await expect(promise).rejects.toThrow(NotFoundException);
    });
    it('should throw an error to refresh token with invalid refresh token ', async () => {
      mockTokenRepository.findByUserId = jest
        .fn()
        .mockResolvedValueOnce(tokenResult);
      const promise = tokenService.refreshToken(
        mockPayload,
        'refreshToken-invalid',
      );
      await expect(promise).rejects.toThrow('Invalid refresh token');
      await expect(promise).rejects.toThrow(UnauthorizedException);
    });
    it('should throw an error to refresh token with Token not found with DB return empty array', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce([]);
      const promise = tokenService.refreshToken(mockPayload, 'refreshToken');
      await expect(promise).rejects.toThrow('Token not found');
      await expect(promise).rejects.toThrow(NotFoundException);
    });
    it('should throw an error to refresh token with Token not found with DB return null', async () => {
      mockTokenRepository.findByUserId = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.refreshToken(mockPayload, 'refreshToken');
      await expect(promise).rejects.toThrow('Token not found');
      await expect(promise).rejects.toThrow(NotFoundException);
    });
    it('should throw an error to refresh token with failure to generate new token ', async () => {
      mockTokenRepository.findByUserId = jest
        .fn()
        .mockResolvedValueOnce(tokenResult);
      mockJwtService.signAsync = jest.fn().mockResolvedValueOnce(null);
      const promise = tokenService.refreshToken(mockPayload, 'refreshToken');
      await expect(promise).rejects.toThrow('Failure to generate new token');
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });
  });
  describe('revokeToken', () => {
    it('should revoke a token', async () => {
      mockTokenRepository.deleteToken = jest.fn().mockResolvedValueOnce({
        affected: 1,
      });
      await tokenService.revokeToken('token');
      expect(mockTokenRepository.deleteToken).toHaveBeenCalledWith('token');
    });
    it('should throw an error to revoke token with failure to delete token ', async () => {
      mockTokenRepository.deleteToken = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });
      const promise = tokenService.revokeToken('token');
      await expect(promise).rejects.toThrow('Failure to delete token');
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });
  });
  describe('tokenIntrospect', () => {
    const tokenResult = {
      id: '1',
      userId: 'userId-01',
      token: 'token',
      refreshToken: 'refreshToken',
      expiresAt: new Date('2023-01-01T00:00:00.000Z'),
    };
    const tokenVerified = {
      sub: 'sub-01',
      username: 'jondoe@example.com',
      aud: 'cleintId-01',
      scope: 'scope1 scope2',
      exp: 1,
      iat: 1,
    };
    it('should introspect a token', async () => {
      mockTokenRepository.findByRefreshToken = jest
        .fn()
        .mockResolvedValueOnce(tokenResult);
      mockJwtService.verifyAsync = jest
        .fn()
        .mockResolvedValueOnce(tokenVerified);
      const result = await tokenService.tokenIntrospect('token');
      expect(result).toEqual({
        active: true,
        sub: 'sub-01',
        client_id: 'cleintId-01',
        scope: 'scope1 scope2',
        exp: 1,
        iat: 1,
      });
    });
    it('should reuturn active false when token not found', async () => {
      mockTokenRepository.findByRefreshToken = jest
        .fn()
        .mockResolvedValueOnce(null);
      const result = await tokenService.tokenIntrospect('token');
      expect(result).toEqual({ active: false });
    });
    it('should return active false when token is invalid', async () => {
      mockTokenRepository.findByRefreshToken = jest
        .fn()
        .mockResolvedValueOnce(tokenResult);
      mockJwtService.verifyAsync = jest.fn().mockResolvedValueOnce(null);
      const result = await tokenService.tokenIntrospect('token');
      expect(result).toEqual({
        active: false,
      });
    });
  });
  describe('findByRefreshToken', () => {
    const tokenResult = {
      id: '1',
      refreshToken: 'refreshToken',
      expiresAt: expect.any(String),
    };
    it('should be find a token', async () => {
      mockTokenRepository.findByRefreshToken = jest
        .fn()
        .mockResolvedValueOnce(tokenResult);
      const result = await tokenService.findByRefreshToken('refreshToken');
      expect(result).toEqual(tokenResult);
    });
  });
});
