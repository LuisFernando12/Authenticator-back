import { CreateClientUseCase } from '@/client/application/use-case/create-client.use-case';
import { clientMocked, ClientMockedType } from './mock/index.mock';

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase;
  let clientMock: ClientMockedType;

  beforeEach(() => {
    clientMock = clientMocked();
    jest.clearAllMocks();
    createClientUseCase = new CreateClientUseCase(
      clientMock.clientRepositoryFake,
      clientMock.generateClientsServiceFake,
      clientMock.configServiceFake,
    );
  });

  const payload = {
    name: 'Test Client',
    redirectUris: ['http://localhost:4000/callback'],
    grantTypes: ['authorization_code'],
    scopes: ['email', 'phone'],
    isConfidential: true,
  };

  it('should be defined', () => {
    expect(createClientUseCase).toBeDefined();
  });

  it('should create a confidential client', async () => {
    const result = await createClientUseCase.execute(payload);

    expect(result.clientId).toBe('test-client-id');
    expect(result.clientSecret).toBe('plain-client-secret');
    expect(result.isConfidential).toBe(true);
  });

  it('should generate a client secret for confidential clients', async () => {
    const generateClientSecretSpy = jest.spyOn(
      clientMock.generateClientsServiceFake,
      'generateClientSecret',
    );

    await createClientUseCase.execute(payload);

    expect(generateClientSecretSpy).toHaveBeenCalledWith(
      'client-secret-pepper',
    );
  });

  it('should create a public client without client secret', async () => {
    const generateClientSecretSpy = jest.spyOn(
      clientMock.generateClientsServiceFake,
      'generateClientSecret',
    );

    const result = await createClientUseCase.execute({
      ...payload,
      isConfidential: false,
    });

    expect(generateClientSecretSpy).not.toHaveBeenCalled();
    expect(result.clientSecret).toBeNull();
    expect(result.isConfidential).toBe(false);
  });

  it('should throw an error if client secret generation fails', async () => {
    jest
      .spyOn(clientMock.generateClientsServiceFake, 'generateClientSecret')
      .mockRejectedValueOnce(new Error('Failure to generate client secret'));

    const promise = createClientUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to generate client secret');
  });

  it('should throw an error if client persistence fails', async () => {
    jest
      .spyOn(clientMock.clientRepositoryFake, 'create')
      .mockRejectedValueOnce(new Error('Failure to create client'));

    const promise = createClientUseCase.execute(payload);

    await expect(promise).rejects.toThrow('Failure to create client');
  });
});
