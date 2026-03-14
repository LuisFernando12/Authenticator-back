import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigEnvService } from '../../../src/service/app-config-env.service';

describe('AppConfigEnvService', () => {
  let appConfigEnvService: AppConfigEnvService;
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigEnvService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    appConfigEnvService = module.get<AppConfigEnvService>(AppConfigEnvService);
  });
  it('should be defined', () => {
    expect(appConfigEnvService).toBeDefined();
  });
  describe('get', () => {
    it('should get USER_DB', () => {
      mockConfigService.get = jest.fn().mockReturnValue('USER_DB');
      const result = appConfigEnvService.userDB;
      expect(result).toBe('USER_DB');
    });
    it('should get DB_PASSWORD', () => {
      mockConfigService.get = jest.fn().mockReturnValue('DB_PASSWORD');
      const result = appConfigEnvService.passwordDB;
      expect(result).toBe('DB_PASSWORD');
    });
    it('should get DB_NAME', () => {
      mockConfigService.get = jest.fn().mockReturnValue('DB_NAME');
      const result = appConfigEnvService.nameDB;
      expect(result).toBe('DB_NAME');
    });
    it('should get DB_PORT', () => {
      mockConfigService.get = jest.fn().mockReturnValue('DB_PORT');
      const result = appConfigEnvService.portDB;
      expect(result).toBe('DB_PORT');
    });
    it('should get SERVICE_URL', () => {
      mockConfigService.get = jest.fn().mockReturnValue('SERVICE_URL');
      const result = appConfigEnvService.serviceURL;
      expect(result).toBe('SERVICE_URL');
    });
    it('should get SERVICE_VERIFY_EMAIL_URL', () => {
      mockConfigService.get = jest
        .fn()
        .mockReturnValue('SERVICE_VERIFY_EMAIL_URL');
      const result = appConfigEnvService.serviceURL;
      expect(result).toBe('SERVICE_VERIFY_EMAIL_URL');
    });
    it('should get SERVICE_RESET_PASSWORD_URL', () => {
      mockConfigService.get = jest
        .fn()
        .mockReturnValue('SERVICE_RESET_PASSWORD_URL');
      const result = appConfigEnvService.serviceResetPasswordUrl;
      expect(result).toBe('SERVICE_RESET_PASSWORD_URL');
    });
    it('should get REDIRECT_URI', () => {
      mockConfigService.get = jest.fn().mockReturnValue('REDIRECT_URI');
      const result = appConfigEnvService.redirectURI;
      expect(result).toBe('REDIRECT_URI');
    });
    it('should get SECRET', () => {
      mockConfigService.get = jest.fn().mockReturnValue('SECRET');
      const result = appConfigEnvService.secret;
      expect(result).toBe('SECRET');
    });
    it('should get SERVER_SMTP', () => {
      mockConfigService.get = jest.fn().mockReturnValue('SERVER_SMTP');
      const result = appConfigEnvService.serverSMTP;
      expect(result).toBe('SERVER_SMTP');
    });
    it('should get SMTP_PORT', () => {
      mockConfigService.get = jest.fn().mockReturnValue('SMTP_PORT');
      const result = appConfigEnvService.smtpPORT;
      expect(result).toBe('SMTP_PORT');
    });
    it('should get SERVER_SMTP_USER_NAME', () => {
      mockConfigService.get = jest
        .fn()
        .mockReturnValue('SERVER_SMTP_USER_NAME');
      const result = appConfigEnvService.serverSMTPUserName;
      expect(result).toBe('SERVER_SMTP_USER_NAME');
    });
    it('should get SERVER_SMTP_PASSWORD', () => {
      mockConfigService.get = jest.fn().mockReturnValue('SERVER_SMTP_PASSWORD');
      const result = appConfigEnvService.serverSMTPPassword;
      expect(result).toBe('SERVER_SMTP_PASSWORD');
    });
    it('should get OAUTH_LOGIN_URL', () => {
      mockConfigService.getOrThrow = jest
        .fn()
        .mockReturnValue('OAUTH_LOGIN_URL');
      const result = appConfigEnvService.oauthLoginURL;
      expect(result).toBe('OAUTH_LOGIN_URL');
    });
    it('should get REDIS_URI', () => {
      mockConfigService.getOrThrow = jest.fn().mockReturnValue('REDIS_URI');
      const result = appConfigEnvService.redisURI;
      expect(result).toBe('REDIS_URI');
    });
  });
});
