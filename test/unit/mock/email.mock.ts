import { IEmailService } from '../../../src/core/application/service/email.service';

export const mockEmailService: IEmailService = {
  sendActivationEmail: jest.fn(),
  resetPassword: jest.fn().mockResolvedValue('OK'),
};
