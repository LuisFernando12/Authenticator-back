import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserClientConsentDTO } from '../../../src/dto/user-client-consent.dto';
import { UserClientConsentRepository } from '../../../src/repository/user-client-consent.repository';
import {
  IUserClientConsentService,
  UserClientConsentService,
} from '../../../src/service/user-client-consent.service';
import { mockUserClientConsentRespository } from './mock/userClient.mock';

describe('UserClientConsentService', () => {
  let userClientConsentService: IUserClientConsentService;
  const mockUserClientConsent: UserClientConsentDTO = {
    userId: 'user-id',
    clientId: 'client-id',
    scopes: ['read', 'write'],
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserClientConsentService,
        {
          provide: UserClientConsentRepository,
          useValue: mockUserClientConsentRespository,
        },
      ],
    }).compile();
    userClientConsentService = module.get<IUserClientConsentService>(
      UserClientConsentService,
    );
  });
  it('should be defined', () => {
    expect(userClientConsentService).toBeDefined();
  });
  describe('create', () => {
    it('should create a user client consent', async () => {
      mockUserClientConsentRespository.create = jest
        .fn()
        .mockResolvedValueOnce(true);
      const result = await userClientConsentService.create(
        mockUserClientConsent,
      );
      expect(result).toBe(true);
      expect(mockUserClientConsentRespository.create).toHaveBeenCalledWith(
        mockUserClientConsent,
      );
    });
    it('should throw an error to create a user client consent', async () => {
      mockUserClientConsentRespository.create = jest
        .fn()
        .mockResolvedValueOnce(null);
      try {
        await userClientConsentService.create(mockUserClientConsent);
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          expect(error.message).toBe('Failure to create user client consent');
        }
      }
    });
  });
  describe('findByUserIdAndClientId', () => {
    it('should find a user client consent by userId and clientId', async () => {
      mockUserClientConsentRespository.findByUserIdAndClientId = jest
        .fn()
        .mockResolvedValueOnce([mockUserClientConsent]);
      const result = await userClientConsentService.findByUserIdAndClientId(
        mockUserClientConsent.userId,
        mockUserClientConsent.clientId,
      );
      expect(result).toEqual([mockUserClientConsent]);
    });
    it('should throw an error to invalid params', async () => {
      try {
        await userClientConsentService.findByUserIdAndClientId(null, null);
      } catch (error) {
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Invalid params');
        }
      }
    });
    it('should throw an error to find a  consent by userId and clientId', async () => {
      mockUserClientConsentRespository.findByUserIdAndClientId = jest
        .fn()
        .mockResolvedValueOnce(null);
      try {
        await userClientConsentService.findByUserIdAndClientId(
          mockUserClientConsent.userId,
          mockUserClientConsent.clientId,
        );
      } catch (error) {
        if (error instanceof NotFoundException) {
          expect(error.message).toBe('Consents not found');
        }
      }
    });
  });
  describe('findByUserId', () => {
    it('should find a user client consent by userId', async () => {
      mockUserClientConsentRespository.findByUserId = jest
        .fn()
        .mockResolvedValueOnce([mockUserClientConsent]);
      const result = await userClientConsentService.findByUserId(
        mockUserClientConsent.userId,
      );
      expect(result).toEqual([mockUserClientConsent]);
    });
    it('should throw an error to invalid param', async () => {
      try {
        await userClientConsentService.findByUserId(null);
      } catch (error) {
        if (error instanceof BadRequestException) {
          expect(error.message).toBe('Invalid param');
        }
      }
    });
    it('should throw error to find a consent by userId', async () => {
      mockUserClientConsentRespository.findByUserId = jest
        .fn()
        .mockResolvedValueOnce([]);
      try {
        await userClientConsentService.findByUserId(
          mockUserClientConsent.userId,
        );
      } catch (error) {
        if (error instanceof NotFoundException) {
          expect(error.message).toBe('Consents not found');
        }
      }
    });
  });
});
