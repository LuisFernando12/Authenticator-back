export interface ISendActivationEmailPayload {
  email: string;
  name: string;
  token: string;
}
export interface IResetPasswordPayload {
  email: string;
  name: string;
  code: number;
}
export interface IBlockAccountPayload {
  email: string;
  username: string;
  code: number;
}
export interface IUnblockAccountPayload {
  email: string;
  username: string;
  tempPassword: string;
}

export const EMAIL_SERVICE_PORT = Symbol('EMAIL_SERVICE_PORT');
export abstract class EmailServicePort {
  abstract sendActivationEmail(
    payload: ISendActivationEmailPayload,
  ): Promise<void>;
  abstract resetPassword(payload: IResetPasswordPayload): Promise<void>;
  abstract blockAccount(payload: IBlockAccountPayload): Promise<void>;
  abstract unblockAccount(payload: IUnblockAccountPayload): Promise<void>;
}
