export interface IBlockAccountPayload {
  email: string;
  username: string;
  code: number;
}

export const EMAIL_SERVICE_PORT = Symbol('EMAIL_SERVICE_PORT');
export abstract class EmailServicePort {
  abstract blockAccount(payload: IBlockAccountPayload): Promise<void>;
}
