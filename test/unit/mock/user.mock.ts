import { IUserRepository } from '@/user/infrastructure/repository/user.repository';

export const mockUserRepository: IUserRepository = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  existsUser: jest.fn(),
  activeAccount: jest.fn(),
  updatePassword: jest.fn(),
};
