export interface IVerifyTokenProps {
  sub: string;
  username: string;
  type: 'access' | 'email_verification';
  jti: string;
  iat: number;
  exp: number;
}
export class VerifyTokenValueObject {
  constructor(readonly verifyTokenProps: IVerifyTokenProps) {}
  static create(verifyTokenProps: IVerifyTokenProps) {
    return new VerifyTokenValueObject(verifyTokenProps);
  }
}
