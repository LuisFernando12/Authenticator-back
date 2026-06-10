import * as crypto from 'node:crypto';
import { ExchangeOauthCodeUseCase } from '../../../../src/oauth/application/use-case/exchange-auth-code.use-case';
import { OauthDomainError } from '../../../../src/oauth/domain/error/oauth-domain.error';
import { oauthMocked, OauthMockedType } from './mock/index.mock';
function hashCodeChallenge(codeVerifier: string): string {
  return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
}
describe('ExchangeAuthCodeUseCase', () => {
  let exchangeOauthCodeUseCase: ExchangeOauthCodeUseCase;
  let oauthMock: OauthMockedType;
  beforeEach(() => {
    oauthMock = oauthMocked();
    jest.clearAllMocks();
    exchangeOauthCodeUseCase = new ExchangeOauthCodeUseCase(
      oauthMock.client,
      oauthMock.tokenServiceFake,
      oauthMock.redisServiceFake,
      oauthMock.hashedClientSecretServiceFake,
      oauthMock.userServiceFake,
      oauthMock.consentServiceFake,
      oauthMock.configServiceFake,
    );
  });
  it('should be defined', () => {
    expect(exchangeOauthCodeUseCase).toBeDefined();
  });
  it('should return a token', async () => {
    const result = await exchangeOauthCodeUseCase.execute({
      grantType: 'authorization_code',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'https://example.com/callback',
      code: 'test-auth-code',
    });
    expect(result.accessToken).toBe('test-access-token');
  });
  it('should return a token pkce flow', async () => {
    jest
      .spyOn(oauthMock.redisServiceFake, 'consumeOauthCode')
      .mockResolvedValueOnce({
        code: 'test-auth-code',
        codeChallenge: hashCodeChallenge('test-code-verifier'),
        codeChallengeMethod: 'sha256',
        scope: 'read write',
        clientId: 'test-client-id',
        redirectUri: 'https://example.com/callback',
        userEmail: 'john.doe@example.com',
      });
    jest.spyOn(oauthMock.client, 'findByClientId').mockResolvedValueOnce(
      oauthMock.mockOauthClient({
        clientId: 'clientId',
        clientSecret: 'test-client-secret',
        isConfidential: false,
        name: 'Test Client',
        redirectUris: ['https://example.com/callback'],
        scopes: ['read', 'write'],
        isActive: true,
      } as any),
    );
    const result = await exchangeOauthCodeUseCase.execute({
      grantType: 'authorization_code',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'https://example.com/callback',
      code: 'test-auth-code',
      codeVerifier: 'test-code-verifier',
    });
    expect(result.accessToken).toBe('test-access-token');
  });
  it('should throw an error if the grant type is not supported', async () => {
    const promise = exchangeOauthCodeUseCase.execute({
      grantType: 'invalid_grant_type',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'https://example.com/callback',
      code: 'test-auth-code',
    });
    await expect(promise).rejects.toThrow(
      'Unsupported grant type invalid_grant_type',
    );
  });
  it('should throw an error if the client is not found', async () => {
    jest
      .spyOn(oauthMock.client, 'findByClientId')
      .mockRejectedValueOnce(
        OauthDomainError.invalidClient('Client not found'),
      );
    const promise = exchangeOauthCodeUseCase.execute({
      grantType: 'authorization_code',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'https://example.com/callback',
      code: 'test-auth-code',
    });
    await expect(promise).rejects.toThrow('Client not found');
  });
  it('should throw an error if the redirect URI is invalid', async () => {
    const promise = exchangeOauthCodeUseCase.execute({
      grantType: 'authorization_code',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'https://invalid-example.com/callback',
      code: 'test-auth-code',
    });
    await expect(promise).rejects.toThrow('Redirect URI not allowed');
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
      } as any),
    );
    const promise = exchangeOauthCodeUseCase.execute({
      grantType: 'authorization_code',
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      redirectUri: 'https://example.com/callback',
      code: 'test-auth-code',
    });
    await expect(promise).rejects.toThrow(
      'Public clients must use the PKCE flow',
    );
  });
  it('should throw an error if a confidential client does not send client secret', async () => {
    jest.spyOn(oauthMock.client, 'findByClientId').mockResolvedValueOnce(
      oauthMock.mockOauthClient({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        isConfidential: true,
        name: 'Test Client',
        redirectUris: ['https://example.com/callback'],
        scopes: ['read', 'write'],
        isActive: true,
      } as any),
    );
    const promise = exchangeOauthCodeUseCase.execute({
      grantType: 'authorization_code',
      clientId: 'test-client-id',
      redirectUri: 'https://example.com/callback',
      code: 'test-auth-code',
    });
    await expect(promise).rejects.toThrow('Client secret is required');
  });
  it('should throw an error if the client secret is invalid', async () => {
    jest.spyOn(oauthMock.client, 'findByClientId').mockResolvedValueOnce(
      oauthMock.mockOauthClient({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        isConfidential: true,
        name: 'Test Client',
        redirectUris: ['https://example.com/callback'],
        scopes: ['read', 'write'],
        isActive: true,
      } as any),
    );
    jest
      .spyOn(oauthMock.hashedClientSecretServiceFake, 'compareHashClientSecret')
      .mockRejectedValueOnce(
        OauthDomainError.invalidClient('Invalid client secret !'),
      );
    await expect(
      exchangeOauthCodeUseCase.execute({
        grantType: 'authorization_code',
        clientId: 'test-client-id',
        clientSecret: 'invalid-client-secret',
        redirectUri: 'https://example.com/callback',
        code: 'test-auth-code',
      }),
    ).rejects.toThrow('Invalid client secret !');
  });
});
