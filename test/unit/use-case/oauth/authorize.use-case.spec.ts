import { AuthorizeUseCase } from '../../../../src/oauth/application/use-case/authorize.use-case';
import { OauthClient } from '../../../../src/oauth/domain/entity/oauth-client.entity';
import { OauthDomainError } from '../../../../src/oauth/domain/error/oauth-domain.error';
import { oauthMocked, OauthMockedType } from './mock/index.mock';

describe('AuthorizeUseCase', () => {
  let authorizeUseCase: AuthorizeUseCase;
  let oauthMock: OauthMockedType;
  beforeEach(() => {
    oauthMock = oauthMocked();
    jest.clearAllMocks();
    authorizeUseCase = new AuthorizeUseCase(
      oauthMock.client,
      oauthMock.generateIdServiceFake,
      oauthMock.redisServiceFake,
      oauthMock.configServiceFake,
    );
  });
  it('should be defined', () => {
    expect(authorizeUseCase).toBeDefined();
  });
  it('should return a URL with Authorization Flow', async () => {
    const result = await authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    expect(result).toBeInstanceOf(URL);
  });
  it('should return a URL with PKCE Flow', async () => {
    const result = await authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
      codeChallenge: 'test-code-challenge',
      codeChallengeMethod: 'sha256',
    });
    expect(result).toBeInstanceOf(URL);
  });
  it('should throw an error if the client is not found', async () => {
    jest
      .spyOn(oauthMock.client, 'findByClientId')
      .mockRejectedValueOnce(
        OauthDomainError.invalidClient('Client not found'),
      );
    const promise = authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    await expect(promise).rejects.toThrow('Client not found');
  });
  it('should throw an error if the redirect URI is invalid', async () => {
    const promise = authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://invalid-example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    await expect(promise).rejects.toThrow('Redirect URI not allowed');
  });
  it('should throw an error if the scopes are invalid', async () => {
    const promise = authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write delete',
    });
    await expect(promise).rejects.toThrow('Scope not allowed');
  });
  it('should throw an error if the client is not confidential', async () => {
    jest.spyOn(oauthMock.client, 'findByClientId').mockResolvedValueOnce(
      oauthMock.mockOauthClient({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        isConfidential: false,
        name: 'Test Client',
        redirectUris: ['https://example.com/callback'],
        scopes: ['read', 'write'],
        isActive: true,
      } as OauthClient),
    );
    const promise = authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    await expect(promise).rejects.toThrow(
      'Public clients must use the PKCE flow',
    );
  });
  it('should throw an error if the client is confidential and has no secret', async () => {
    jest.spyOn(oauthMock.client, 'findByClientId').mockResolvedValueOnce(
      oauthMock.mockOauthClient({
        clientId: 'test-client-id',
        isConfidential: true,
        name: 'Test Client',
        redirectUris: ['https://example.com/callback'],
        scopes: ['read', 'write'],
        isActive: true,
      } as OauthClient),
    );
    const promise = authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    await expect(promise).rejects.toThrow(
      'Private clients must send client secret',
    );
  });
  it('should throw an error if it fails to save the authorization request on Redis', async () => {
    jest
      .spyOn(oauthMock.redisServiceFake, 'saveAuthRequest')
      .mockRejectedValueOnce(
        OauthDomainError.invalidGrant('Failure to save authRequest on redis!'),
      );
    const promise = authorizeUseCase.execute({
      responseType: 'code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    await expect(promise).rejects.toThrow(
      'Failure to save authRequest on redis!',
    );
  });
  it('should throw an error if the response type is not code', async () => {
    const promise = authorizeUseCase.execute({
      responseType: 'token',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      state: 'test-state',
      scope: 'read write',
    });
    await expect(promise).rejects.toThrow('Unsupported response type token');
  });
});
