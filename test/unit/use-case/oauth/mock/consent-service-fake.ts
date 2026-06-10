import { ConsentServicePort } from '@/oauth/application/port/user-client-consent-service.port';
export interface IUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: Date;
}
export interface IClient {
  id: string;
  clientId: string;
  clientSecret: string;
  isConfidential: boolean;
  name: string;
  redirectUris: Array<string>;
  grantTypes: Array<string>;
  scopes: Array<string>;
  isActive: boolean;
  createdAt: Date;
}
interface IConsentProps {
  id?: string;
  scopes: Array<string>;
  userId: string;
  clientId: string;
  user?: IUser;
  client?: IClient;
  grantedAt?: Date;
  expiresAt?: Date | null;
  revokeAt?: Date | null;
}
export class ConsentServiceFake implements ConsentServicePort {
  private user: IUser = jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'john.doe@example.com',
    password: 'test-user-password',
    name: 'test-user-name',
    isVerified: true,
    createdAt: new Date(),
  }) as any;

  private client: IClient = jest.fn().mockResolvedValue({
    id: 'test-client-id',
    name: 'Test Client',
    redirectUris: ['http://localhost/callback'],
    isValidRedirectUri: jest.fn().mockReturnValue(true),
    startAuthorizationCodeFlow: jest.fn(),
    scopes: ['read', 'write'],
    isActive: true,
    clientSecret: 'test-client-secret',
    isConfidential: true,
  }) as any;

  findByConsentId(consentId: string): Promise<IConsentProps> {
    if (consentId === 'test-consent-id') {
      return Promise.resolve({
        id: 'test-consent-id',
        scopes: ['read', 'write'],
        userId: 'test-user-id',
        clientId: 'test-client-id',
        user: this.user,
        client: this.client,
        grantedAt: new Date(),
        revokeAt: null,
      });
    }
    return Promise.resolve(null);
  }
  findConsentByUserIdAndClientId(
    userId: string,
    clientId: string,
  ): Promise<IConsentProps> {
    if (clientId === 'test-client-id') {
      return Promise.resolve({
        id: 'test-consent-id',
        scopes: ['read', 'write'],
        userId: userId,
        clientId: 'test-client-id',
        user: this.user,
        client: this.client,
        grantedAt: new Date(),
        revokeAt: null,
      });
    }
    return Promise.resolve(null);
  }
  findOrCreateConsent(
    userId: string,
    clientId: string,
    scope: string,
  ): Promise<void | IConsentProps> {
    if (userId === 'test-user-id' && clientId === 'test-client-id') {
      return Promise.resolve({
        id: 'test-consent-id',
        scopes: scope.split(' '),
        userId: 'test-user-id',
        clientId: 'test-client-id',
        user: this.user,
        client: this.client,
        grantedAt: new Date(),
        revokeAt: null,
      });
    }
    return Promise.resolve(null);
  }
}
