export interface IGenerateEmailVerificationToken {
  sub: string;
  username: string;
}

export const TOKEN_SERVICE_PORT = Symbol('TOKEN_SERVICE_PORT');
export abstract class TokenServicePort {
  abstract generateEmailVerificationToken(
    payload: IGenerateEmailVerificationToken,
  ): Promise<string>;
}
