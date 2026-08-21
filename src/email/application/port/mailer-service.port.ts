export const MAILER_SERVICE_PORT = Symbol('MAILER_SERVICE_PORT');
export interface ISendEmailPayload {
  from?: {
    name: string;
    address: string;
    email?: string;
  };
  to: string;
  subject: string;
  template: string;
  context: {
    username: string;
    resetPasswordURL?: string;
    activeUrl?: string;
    unblockAccountURL?: string;
    tempPassword?: string;
    code?: string;
  };
}
export abstract class MailerServicePort {
  abstract sendMail(payload: ISendEmailPayload): Promise<void>;
}
