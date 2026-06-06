import { IClientRepository } from '../../../src/client/infrastructure/repository/client.repository';
import { IClientService } from '../../../src/oauth/infrastructure/adapter/client-service.adapter';

export const mockClientRepository: IClientRepository = {
  create: jest.fn(),
  findByClientId: jest.fn(),
  findByClientSecret: jest.fn(),
};
export const mockClientService: IClientService = {
  create: jest.fn(),
  findByClientId: jest.fn(),
};
