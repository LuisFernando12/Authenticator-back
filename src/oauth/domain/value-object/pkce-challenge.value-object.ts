import * as crypto from 'node:crypto';
import { OauthDomainError } from '../error/oauth-domain.error';
export class PkceChallengeValueObject {
  constructor(
    private readonly challenge: string,
    private readonly challengeMathod: string,
  ) {}
  static create(codeChallenge: string, codeChallengeMethod: string) {
    if (!codeChallenge && !codeChallengeMethod) {
      return undefined;
    }
    if (!codeChallenge || !codeChallengeMethod) {
      throw OauthDomainError.invalidRequest(
        'Code challenge and code challenge method are required together',
      );
    }
    if (codeChallengeMethod.toLowerCase() !== 'sha256') {
      throw OauthDomainError.invalidRequest('Invalid challenge method!');
    }
    return new PkceChallengeValueObject(codeChallenge, codeChallengeMethod);
  }
  verify(codeVerifier: string) {
    const codeChallegeVerify = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');
    if (this.challenge !== codeChallegeVerify) {
      throw new Error('Invalid code verifier');
    }
  }
}
