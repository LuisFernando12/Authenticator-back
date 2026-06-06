export interface IUserProps {
  id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
}
export class OauthUser {
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
}
