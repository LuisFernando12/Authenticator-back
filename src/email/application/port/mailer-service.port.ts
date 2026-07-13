export const MAILER_SERVICE_PORT = Symbol('MAILER_SERVICE_PORT');
export interface ISendEmailPayload {
  to: string;
  subject: string;
  template: string;
  context: {
    username: string;
    resetPasswordURL?: string;
    activeUrl?: string;
    code?: string;
  };
}
export abstract class MailerServicePort {
  abstract sendMail(payload: ISendEmailPayload): Promise<void>;
}
