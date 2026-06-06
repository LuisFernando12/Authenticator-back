import { PkceChallengeValueObject } from '@/oauth/domain/value-object/pkce-challenge.value-object';
import { OauthDomainError } from '../error/oauth-domain.error';
import { RedirectUriValueObject } from '../value-object/redirectUri.value-object';
import { ScopeValueObject } from '../value-object/scopes.value-object';
interface ClientProps {
  clientId: string;
  clientSecret?: string;
  isConfidential: boolean;
  name: string;
  redirectUris: Array<string>;
  scopes: Array<string>;
  isActive: boolean;
}
export class OauthClient {
  constructor(private readonly client: ClientProps) {}
  get clientId(): string {
    return this.client.clientId;
  }
  get clientSecret(): string {
    return this.client.clientSecret;
  }
  get isConfidential(): boolean {
    return this.client.isConfidential;
  }
  get name(): string {
    return this.client.name;
  }
  get redirectUris(): Array<string> {
    return this.client.redirectUris;
  }
  get scopes(): Array<string> {
    return this.client.scopes;
  }
  get isActive(): boolean {
    return this.client.isActive;
  }

  isValidRedirectUri(redirectUri: RedirectUriValueObject | string): void {
    redirectUri =
      typeof redirectUri === 'string'
        ? RedirectUriValueObject.create(redirectUri)
        : redirectUri;
    const allowed = this.client.redirectUris.some((uri) =>
      redirectUri.equals(uri),
    );
    if (!allowed) {
      throw OauthDomainError.invalidGrant('Redirect URI not allowed');
    }
  }
  grantTypeIsSuspported(grantType: string): void {
    if (grantType !== 'authorization_code') {
      throw OauthDomainError.unsupportedGrantType(
        `Unsupported grant type ${grantType || ''}`,
      );
    }
  }
  isValidScopes(scopes: ScopeValueObject | string): void {
    scopes =
      typeof scopes === 'string' ? ScopeValueObject.create(scopes) : scopes;
    if (!this.scopes?.length) {
      return;
    }
    if (!scopes.contains(this.scopes)) {
      throw OauthDomainError.invalidGrant('Scope not allowed');
    }
  }
  startAuthorizationCodeFlow(isPKCE: boolean): void {
    if (!this.isConfidential && !isPKCE) {
      throw OauthDomainError.invalidRequest(
        'Public clients must use the PKCE flow',
      );
    }
    if (this.isConfidential && !this.clientSecret) {
      throw OauthDomainError.invalidRequest(
        'Private clients must send client secret',
      );
    }
  }
  validPkceChallenge(
    pckeChallenge: PkceChallengeValueObject,
    codeVerfier: string,
  ): void {
    if (codeVerfier) {
      pckeChallenge.verify(codeVerfier);
    }
    return;
  }
  exchangeCodeToTokenWithoutPKCE(): void {
    if (!this.isConfidential) {
      throw OauthDomainError.invalidClient(
        'Public clients do not exchange code to token without PKCE',
      );
    }
  }
}
