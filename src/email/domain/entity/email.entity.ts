export interface EmailProps {
  email: string;
  username: string;
  token?: string;
  code?: number;
}
export class Email {
  constructor(private readonly emailProps: EmailProps) {
    if (!emailProps.email) throw new Error('Email is required');
    if (!emailProps.username) throw new Error('Username is required');
    if (emailProps.token && emailProps.code)
      throw new Error('Code or token is required');
  }

  get email(): string {
    return this.emailProps.email;
  }

  get username(): string {
    return this.emailProps.username;
  }

  get token(): string | undefined {
    return this.emailProps.token;
  }

  get code(): number | undefined {
    return this.emailProps.code;
  }
}
