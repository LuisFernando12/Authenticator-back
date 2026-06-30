import { OauthDomainError } from '../error/oauth-domain.error';

export interface IOauthRequestProps {
  oauthRequestId?: string;
  clientId: string;
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  state: string;
  scope: string;
}

export class OauthRequest {
  constructor(
    private readonly oauthRequestProps: Required<IOauthRequestProps>,
  ) {}
  get oauthRequestId(): string {
    return this.oauthRequestProps.oauthRequestId;
  }
  get clientId(): string {
    return this.oauthRequestProps.clientId;
  }
  get redirectUri(): string {
    return this.oauthRequestProps.redirectUri;
  }
  get codeChallenge(): string | null {
    return this.oauthRequestProps.codeChallenge;
  }
  get codeChallengeMethod(): string | null {
    return this.oauthRequestProps.codeChallengeMethod;
  }
  get state(): string {
    return this.oauthRequestProps.state;
  }
  get scope(): string {
    return this.oauthRequestProps.scope;
  }

  static create(oauthRequestProps: Required<IOauthRequestProps>) {
    return new OauthRequest(oauthRequestProps);
  }
  stringify() {
    return JSON.stringify(this.oauthRequestProps);
  }
  static parseJSON(stringObjectOauthRequest: string) {
    return new OauthRequest(JSON.parse(stringObjectOauthRequest));
  }
  requestMatch(oauthRequest: IOauthRequestProps) {
    if (this.oauthRequestProps.clientId !== oauthRequest.clientId) {
      throw OauthDomainError.invalidClient('Invalid client ID');
    }
    if (this.oauthRequestProps.redirectUri !== oauthRequest.redirectUri) {
      throw OauthDomainError.invalidRequest('Invalid redirect URI');
    }
    if (this.oauthRequestProps.state !== oauthRequest.state) {
      throw OauthDomainError.invalidRequest('Invalid state');
    }
    if (this.oauthRequestProps.scope !== oauthRequest.scope) {
      throw OauthDomainError.invalidRequest('Invalid scope');
    }
    if (this.oauthRequestProps.codeChallenge && !oauthRequest.codeChallenge) {
      throw OauthDomainError.invalidRequest('Code challenge is required');
    }
    if (this.oauthRequestProps.codeChallenge !== oauthRequest.codeChallenge) {
      throw OauthDomainError.invalidRequest('Code challenge mismatch');
    }
    if (
      this.oauthRequestProps.codeChallengeMethod &&
      !oauthRequest.codeChallengeMethod
    ) {
      throw OauthDomainError.invalidRequest(
        'Code challenge method is required',
      );
    }
    if (
      this.oauthRequestProps.codeChallengeMethod !==
      oauthRequest.codeChallengeMethod
    ) {
      throw OauthDomainError.invalidRequest('Code challenge method mismatch');
    }
  }
}
