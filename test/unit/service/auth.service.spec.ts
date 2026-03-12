import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../../src/repository/user.repository';
import { AppConfigEnvService } from '../../../src/service/app-config-env.service';
import { AuthService, IAuthService } from '../../../src/service/auth.service';
import { EmailService } from '../../../src/service/email.service';
import { RedisService } from '../../../src/service/redis.service';
import { TokenService } from '../../../src/service/token.service';
import { mockAppconfigEnvService } from './mock/appConfigEnv.mock';
import { mockEmailService } from './mock/email.mock';
import { mockRedisService } from './mock/redis.mock';
import { mockTokenService } from './mock/token.mock';
import { mockUserRepository } from './mock/user.mock';
function encryptPassword(password: string): string {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}
describe('AuthService', () => {
  let authService: IAuthService;
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: encryptPassword('password123'),
    isVerified: true,
    userClientConsent: [],
    createdAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: AppConfigEnvService,
          useValue: mockAppconfigEnvService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();
    authService = module.get<IAuthService>(AuthService);
  });
  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('login', () => {
    const password = 'password123';
    it('should login a user', async () => {
      mockUser.isVerified = true;
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce('token');
      const result = await authService.login(mockUser.email, password);
      expect(result).toEqual({
        token: 'token',
        redirect_uri: mockAppconfigEnvService.redirectURI,
      });
    });
    it('should throw an error to login a user', async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      try {
        await authService.login(mockUser.email, password);
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          expect(error.message).toBe(
            'Email or Password incorrect, please verify and try again',
          );
        }
      }
    });
    it('should throw an error to login a user with wrong password', async () => {
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      try {
        await authService.login(mockUser.email, 'wrongpassword');
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          expect(error.message).toBe(
            'Email or Password incorrect, please verify and try again',
          );
        }
      }
    });
    it('should throw an error to login a user with unverified account', async () => {
      mockUser.isVerified = false;
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      try {
        await authService.login(mockUser.email, password);
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          expect(error.message).toBe(
            'Please verify your email and active your account',
          );
        }
      }
    });
  });
  describe('verifyEmail', () => {
    const token = {
      sub: '1',
      username: 'john.doe@example.com',
      type: 'verify-email',
    };

    it('should verify an email', async () => {
      mockTokenService.verifyToken = jest.fn().mockResolvedValueOnce(token);
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockUserRepository.activeAccount = jest.fn().mockResolvedValueOnce(true);
      const result = await authService.verifyEmail('token');
      expect(result).toEqual({ message: 'Account activated successfully' });
    });
    it('should throw an error to verify an email with invalid token', async () => {
      mockTokenService.verifyToken = jest.fn().mockResolvedValueOnce(false);
      try {
        await authService.verifyEmail('token');
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          expect(error.message).toBe('Unauthorized');
        }
      }
    });
    it('should throw a error to verify email with a invalid user', async () => {
      mockTokenService.verifyToken = jest.fn().mockResolvedValueOnce(token);
      mockUserRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      try {
        await authService.verifyEmail('token');
      } catch (error) {
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Bad Request');
        }
      }
    });
    it('should throw a error to active account', async () => {
      mockTokenService.verifyToken = jest.fn().mockResolvedValueOnce(token);
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockUserRepository.activeAccount = jest.fn().mockResolvedValueOnce(false);
      try {
        await authService.verifyEmail('token');
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to activate account');
        }
      }
    });
  });
  describe('resetPassword', () => {
    const email = 'john.doe@example.com';
    it('should reset password', async () => {
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockRedisService.set = jest.fn().mockResolvedValueOnce('reset-password');
      mockEmailService.resetPassword = jest.fn().mockResolvedValueOnce('OK');
      const result = await authService.resetPassword(email);
      expect(result).toEqual({ message: 'Recovery Email Sent ' });
    });
    it('should throw an error to reset password with invalid user', async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      try {
        await authService.resetPassword(email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          expect(error.message).toBe('User not found');
        }
      }
    });
    it('should throw an error to reset password with failure to send email', async () => {
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockRedisService.set = jest.fn().mockResolvedValueOnce('reset-password');
      mockEmailService.resetPassword = jest
        .fn()
        .mockResolvedValueOnce('Failure to send email');
      try {
        await authService.resetPassword(email);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to reset password, try again');
        }
      }
    });
  });
  describe('newPassword', () => {
    const password = 'password123';
    const code = 123456;
    const email = 'john.doe@example.com';
    it('should update password', async () => {
      mockRedisService.get = jest.fn().mockResolvedValueOnce(code);
      mockUserRepository.updatePassword = jest.fn().mockResolvedValueOnce(true);
      mockRedisService.del = jest.fn().mockResolvedValueOnce(true);
      const result = await authService.newPassword(password, code, email);
      expect(result).toEqual({ message: 'Updated password' });
    });
    it('should throw an error to update password with invalid code', async () => {
      mockRedisService.get = jest.fn().mockResolvedValueOnce(null);
      try {
        await authService.newPassword(password, code, email);
      } catch (error) {
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Invalid code !');
        }
      }
    });
    it('should throw an error to update password with failure to update password', async () => {
      mockRedisService.get = jest.fn().mockResolvedValueOnce(code);
      mockUserRepository.updatePassword = jest
        .fn()
        .mockResolvedValueOnce(false);
      try {
        await authService.newPassword(password, code, email);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to update password');
        }
      }
    });
  });
  describe('sendNewTokenToEmailActive', () => {
    const email = 'john.doe@example.com';
    mockUser.isVerified = false;
    it('should send new token to email active', async () => {
      mockUser.isVerified = false;
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce('token');
      mockEmailService.sendActivationEmail = jest
        .fn()
        .mockResolvedValueOnce('OK');
      const result = await authService.sendNewTokenToEmailActive(email);
      expect(result).toBe('OK');
    });
    it('should throw an error to send new token to email active with invalid user', async () => {
      mockUserRepository.findByEmail = jest.fn().mockResolvedValueOnce(null);
      try {
        const user = await authService.sendNewTokenToEmailActive(email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          expect(error.message).toBe('User not found');
        }
      }
    });
    it('should throw an error to send new token to email active with account already active', async () => {
      mockUser.isVerified = true;
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      try {
        await authService.sendNewTokenToEmailActive(email);
      } catch (error) {
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Account already active');
        }
      }
    });
    it('should throw an error to generate token', async () => {
      mockUser.isVerified = false;
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce(false);
      try {
        await authService.sendNewTokenToEmailActive(email);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to generate token');
        }
      }
    });
    it('should throw an error to send new token to email to active account', async () => {
      jest.clearAllMocks();
      mockUserRepository.findByEmail = jest
        .fn()
        .mockResolvedValueOnce(mockUser);
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce('token');
      mockEmailService.sendActivationEmail = jest
        .fn()
        .mockResolvedValueOnce('Failure to send email');
      try {
        await authService.sendNewTokenToEmailActive(email);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to send email');
        }
      }
    });
  });
});
