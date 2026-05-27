import { AuthDomainError } from '../error/auth-domain.error';

export interface IUserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
}
export enum AuthFlow {
  login = 'login',
  activeAccount = 'activeAccount',
  resetPassword = 'resetPassword',
  newPassword = 'newPassword',
  sendNewTokenToEmailActive = 'sendNewTokenToEmailActive',
}
export class AuthUser {
  constructor(private readonly userProps: IUserProps) {}
  get id(): string {
    return this.userProps.id;
  }
  get name(): string {
    return this.userProps.name;
  }
  get email(): string {
    return this.userProps.email;
  }
  get password(): string {
    return this.userProps.password;
  }
  get isVerified(): boolean {
    return this.userProps.isVerified;
  }
  get createdAt(): Date {
    return this.userProps.createdAt;
  }

  passwordMismatch(isMatchedPassword: boolean): void {
    if (!isMatchedPassword) {
      throw AuthDomainError.unauthorized(
        'Email or Password incorrect, please verify and try again',
      );
    }
    return;
  }
  isVerifiedAccount(flow: AuthFlow): void {
    if (
      flow === AuthFlow.sendNewTokenToEmailActive ||
      flow === AuthFlow.activeAccount
    ) {
      if (this.userProps.isVerified)
        throw AuthDomainError.badRequest('Account already active');
    } else {
      if (!this.userProps.isVerified)
        throw AuthDomainError.badRequest('Account not verified');
    }
  }
  isSamePassword(value: boolean) {
    if (value) {
      throw AuthDomainError.conflict(
        'Password already used, please try again with another password!',
        {
          description: 'PASSWORD_ALREADY_USED',
        },
      );
    }
  }
}
