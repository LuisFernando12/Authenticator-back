import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { UserDTO } from '../../../src/dto/user.dto';
import { UserEntity } from '../../../src/entity/user.entity';
import { UserRepository } from '../../../src/repository/user.repository';
import { EmailService } from '../../../src/service/email.service';
import { TokenService } from '../../../src/service/token.service';
import { UserService } from '../../../src/service/user.service';
import { mockEmailService } from './mock/email.mock';
import { mockTokenService } from './mock/token.mock';
import { mockUserRepository } from './mock/user.mock';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  // const mockEmailService: IEmailService = {
  //   sendActivationEmail: jest.fn(),
  //   resetPassword: jest.fn().mockResolvedValue('OK'),
  // };
  // const mockUserRepository: IUserRepository = {
  //   create: jest.fn(),
  //   findByEmail: jest.fn(),
  //   existsUser: jest.fn(),
  //   activeAccount: jest.fn(),
  //   updatePassword: jest.fn(),
  // };
  // const mockTokenService: ITokenService = {
  //   generateToken: jest.fn().mockResolvedValue('token'),
  //   saveToken: jest.fn().mockResolvedValue({
  //     access_token: 'token',
  //     expiresAt: '2023-01-01T00:00:00.000Z',
  //   }),
  //   verifyToken: jest.fn().mockResolvedValue(true),
  //   decodeToken: jest.fn().mockResolvedValue({
  //     sub: '1',
  //     username: 'john.doe@example.com',
  //   }),
  // };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();
    userService = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
  describe('register', () => {
    const user: UserDTO = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
    };
    it('should register a new user', async () => {
      mockUserRepository.create = jest.fn().mockResolvedValueOnce(user);
      mockUserRepository.existsUser = jest.fn().mockResolvedValueOnce(false);
      mockUserRepository.activeAccount = jest.fn().mockResolvedValueOnce(true);
      mockEmailService.sendActivationEmail = jest
        .fn()
        .mockResolvedValueOnce('OK');

      const result = await userService.register(user);
      expect(result).toBe('OK');
      expect(mockUserRepository.create).toHaveBeenCalledWith(user);
    });
    it('should throw an error if user already exists', async () => {
      mockUserRepository.existsUser = jest.fn().mockResolvedValueOnce(true);
      mockUserRepository.create = jest.fn().mockResolvedValueOnce(user);

      try {
        await userService.register(user);
      } catch (error) {
        if (error instanceof ConflictException) {
          expect(error.message).toBe('User alredy exists');
        }
      }
    });
    it('should throw an error to create a user in DB', async () => {
      mockUserRepository.create = jest.fn().mockResolvedValueOnce(null);
      await mockUserRepository.create(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith(user);
      expect(mockUserRepository.existsUser).toHaveBeenCalledWith(user.email);
      try {
        await userService.register(user);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('failed user resgiter');
        }
      }
    });
    it('should throw an error on verification token ', async () => {
      mockUserRepository.create = jest.fn().mockResolvedValueOnce(user);
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce(null);
      try {
        await userService.register(user);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to generate token');
        }
      }
    });
    it('should show  a message "Failure to send email" ', async () => {
      mockTokenService.generateToken = jest.fn().mockResolvedValueOnce('token');
      mockUserRepository.create = jest.fn().mockResolvedValueOnce(user);
      mockEmailService.sendActivationEmail = jest
        .fn()
        .mockResolvedValueOnce('Failure to send email');
      const result = await userService.register(user);
      expect(mockEmailService.sendActivationEmail).toHaveBeenCalledWith(
        user.email,
        user.name,
        'token',
      );
      expect(result).toBe('Failure to send email');
    });
  });
  describe('findByEmail', () => {
    const email = 'john.doe@example.com';
    it('should find a user by email', async () => {
      const createdAt = new Date();
      mockUserRepository.findByEmail = jest.fn().mockResolvedValueOnce({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        isVerified: true,
        userClientConsent: [],
        createdAt: createdAt,
      });
      const result = await userService.findByEmail(email);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        isVerified: true,
        userClientConsent: [],
        createdAt: createdAt,
      });
    });
    it('should throw an error to find a user by email', async () => {
      mockUserRepository.findByEmail = jest.fn().mockRejectedValueOnce(null);
      try {
        await userService.findByEmail(email);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to find user');
        }
      }
    });
  });
});
