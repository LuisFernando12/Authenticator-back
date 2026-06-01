export interface ISendActivationEmailPayload {
  email: string;
  name: string;
  token: string;
}

export const EMAIL_SERVICE_PORT = Symbol('EMAIL_SERVICE_PORT');
export abstract class EmailServicePort {
  abstract sendActivationEmail(
    emailPayload: ISendActivationEmailPayload,
  ): Promise<string>;
}
