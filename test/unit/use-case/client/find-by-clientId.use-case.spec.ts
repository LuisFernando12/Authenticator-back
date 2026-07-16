import { FindByClientIdUseCase } from '@/client/application/use-case/find-by-clientId.use-case';
import { clientMocked, ClientMockedType } from './mock/index.mock';

describe('FindByClientIdUseCase', () => {
  let findByClientIdUseCase: FindByClientIdUseCase;
  let clientMock: ClientMockedType;

  beforeEach(() => {
    clientMock = clientMocked();
    jest.clearAllMocks();
    findByClientIdUseCase = new FindByClientIdUseCase(
      clientMock.clientRepositoryFake,
    );
  });

  it('should be defined', () => {
    expect(findByClientIdUseCase).toBeDefined();
  });

  it('should find a client by client id', async () => {
    const result = await findByClientIdUseCase.execute('test-client-id');

    expect(result.clientId).toBe('test-client-id');
  });

  it('should hide the client secret', async () => {
    const result = await findByClientIdUseCase.execute('test-client-id');

    expect(result.clientSecret).toBe('********************');
  });

  it('should throw an error if client lookup fails', async () => {
    jest
      .spyOn(clientMock.clientRepositoryFake, 'findByClientId')
      .mockRejectedValueOnce(new Error('Client not found'));

    const promise = findByClientIdUseCase.execute('invalid-client-id');

    await expect(promise).rejects.toThrow('Client not found');
  });
});
