import { ITokenService } from '../../../src/token/application/service/token.service';

export const MockTokenService: ITokenService = {
  generate: jest.fn(),
  refreshToken: jest.fn(),
  revoke: jest.fn(),
  tokenIntrospect: jest.fn(),
  verify: jest.fn(),
  findByRefreshToken: jest.fn(),
  generateEmailVerificationToken: jest.fn(),
};
