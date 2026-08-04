import { CreateSecurityEventUseCase } from '@/security-event/application/use-cases/create-security-event.use-case';
import {
  securityEventMocked,
  SecurityEventMockedType,
} from './mock/index.mock';

describe('CreateSecurityEventUseCase', () => {
  let createSecurityEventUseCase: CreateSecurityEventUseCase;
  let securityEventMock: SecurityEventMockedType;

  beforeEach(() => {
    securityEventMock = securityEventMocked();
    jest.clearAllMocks();
    createSecurityEventUseCase = new CreateSecurityEventUseCase(
      securityEventMock.securityEventRepositoryFake,
      securityEventMock.securityEventLoggerFake,
    );
  });

  it('should be defined', () => {
    expect(createSecurityEventUseCase).toBeDefined();
  });

  it('should create a security event', async () => {
    const securityEvent = securityEventMock.mockSecurityEvent();

    const result = await createSecurityEventUseCase.execute(securityEvent);

    expect(result).toBe(securityEvent);
  });

  it('should log the security event creation', async () => {
    const logSpy = jest.spyOn(securityEventMock.securityEventLoggerFake, 'log');
    const securityEvent = securityEventMock.mockSecurityEvent();

    await createSecurityEventUseCase.execute(securityEvent);

    expect(logSpy).toHaveBeenCalledWith(
      `Create security event: ${JSON.stringify(securityEvent)}`,
      {
        context: 'CreateSecurityEventUseCase',
      },
    );
  });

  it('should persist the security event', async () => {
    const createSpy = jest.spyOn(
      securityEventMock.securityEventRepositoryFake,
      'create',
    );
    const securityEvent = securityEventMock.mockSecurityEvent();

    await createSecurityEventUseCase.execute(securityEvent);

    expect(createSpy).toHaveBeenCalledWith(securityEvent);
  });

  it('should throw an error if security event persistence fails', async () => {
    jest
      .spyOn(securityEventMock.securityEventRepositoryFake, 'create')
      .mockRejectedValueOnce(new Error('Failure to create security event'));
    const securityEvent = securityEventMock.mockSecurityEvent();

    const promise = createSecurityEventUseCase.execute(securityEvent);

    await expect(promise).rejects.toThrow('Failure to create security event');
  });
});
