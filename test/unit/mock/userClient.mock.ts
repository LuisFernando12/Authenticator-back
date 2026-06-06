import { ConsentService } from '../../../src/consent/application/service/consent.service';
import { IConsentRepository } from '../../../src/consent/infrastructure/repository/consent.repository';

export const mockUserClientConsentRespository: IConsentRepository = {
  create: jest.fn(),
  findByUserIdAndClientId: jest.fn(),
  findByUserId: jest.fn(),
  findByConsentId: jest.fn(),
};
export const mockUserClientConsentService: ConsentService = {
  create: jest.fn(),
  findByUserIdAndClientId: jest.fn(),
  findByUserId: jest.fn(),
  findByConsentId: jest.fn(),
};
