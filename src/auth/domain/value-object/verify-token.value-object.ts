export interface IVerifyTokenProps {
  sub: string;
  username: string;
  type: 'access' | 'email_verification';
  jti: string;
  iat: number;
  exp: number;
}
export class VerifyTokenValueObject {
  constructor(private readonly verifyTokenProps: IVerifyTokenProps) {}
  get sub(): string {
    return this.verifyTokenProps.sub;
  }
  get username(): string {
    return this.verifyTokenProps.username;
  }
  get type(): 'access' | 'email_verification' {
    return this.verifyTokenProps.type;
  }
  get jti(): string {
    return this.verifyTokenProps.jti;
  }
  get iat(): number {
    return this.verifyTokenProps.iat;
  }
  get exp(): number {
    return this.verifyTokenProps.exp;
  }
  static create(verifyTokenProps: IVerifyTokenProps) {
    return new VerifyTokenValueObject(verifyTokenProps);
  }
}
