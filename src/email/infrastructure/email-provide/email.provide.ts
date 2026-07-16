export interface ISendEmail {
  from?: {
    name: string;
    address: string;
    email?: string;
  };
  to: string;
  subject: string;
  htmlTemplate: string;
}
export interface IContextTemplate {
  username: string;
  resetPasswordURL?: string;
  activeUrl?: string;
  code?: string;
}

export const EMAIL_PROVIDE = Symbol('EMAIL_PROVIDE');
export abstract class EmailProvide {
  abstract sendMail(payload: ISendEmail): Promise<void>;
}
