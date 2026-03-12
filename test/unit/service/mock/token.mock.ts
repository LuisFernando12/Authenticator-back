import { ITokenService } from '../../../../src/service/token.service';

export const mockTokenService: ITokenService = {
  generateToken: jest.fn().mockResolvedValue('token'),
  saveToken: jest.fn().mockResolvedValue({
    access_token: 'token',
    expiresAt: '2023-01-01T00:00:00.000Z',
  }),
  verifyToken: jest.fn().mockResolvedValue(true),
  decodeToken: jest.fn().mockResolvedValue({
    sub: '1',
    username: 'john.doe@example.com',
  }),
};
