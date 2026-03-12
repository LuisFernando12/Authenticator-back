import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SaveClientDTO } from '../../../src/dto/save-client.dto';
import { OauthError } from '../../../src/errors/oauth.error';
import { ClientService } from '../../../src/service/client.service';
import {
  ClientRepository,
  IClientRepository,
} from './../../../src/repository/client.repository';

describe('ClientService', () => {
  const client: SaveClientDTO = {
    name: 'Test Client',
    redirectUris: ['http://localhost:3000/callback'],
    grantTypes: ['authorization_code'],
    scopes: ['read', 'write'],
  };

  let clientService: ClientService;
  const mockClientRepository: IClientRepository = {
    create: jest.fn(),
    findByClientId: jest.fn(),
    findByClientSecret: jest.fn(),
  };
  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: ClientRepository,
          useValue: mockClientRepository,
        },
      ],
    }).compile();
    clientService = moduleRef.get<ClientService>(ClientService);
  });
  it('should be defined', () => {
    expect(clientService).toBeDefined();
  });
  describe('create', () => {
    it('should create a new client', async () => {
      mockClientRepository.create = jest.fn().mockResolvedValueOnce(client);
      const result = await clientService.create(client);
      expect(result).toEqual(client);
      expect(mockClientRepository.create).toHaveBeenCalledWith(client);
    });
    it('should throw an error to create a client', async () => {
      mockClientRepository.create = jest.fn().mockRejectedValueOnce(null);
      try {
        await clientService.create(client);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
  describe('findByClientId', () => {
    const clientId = 'test-client-id';
    it('should find a client by clientId', async () => {
      mockClientRepository.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(client);
      const result = await clientService.findByClientId(clientId);
      expect(mockClientRepository.findByClientId).toHaveBeenCalledWith(
        clientId,
      );
      expect(result).toEqual(client);
    });
    it('should throw an error to find a client by clientId if clientId is null', async () => {
      try {
        await clientService.findByClientId(null);
      } catch (error) {
        expect(error).toBeInstanceOf(OauthError);
      }
    });
    it('should throw an error to find a client by clientId', async () => {
      mockClientRepository.findByClientId = jest
        .fn()
        .mockResolvedValueOnce(null);
      try {
        await clientService.findByClientId(clientId);
      } catch (error) {
        if (error instanceof OauthError) {
          expect(error.message).toBe('Client not found');
        }
      }
    });
  });
});
