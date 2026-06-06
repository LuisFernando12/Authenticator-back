export const USER_VALIDATE_CREDENTIALS_SERVICE_PORT = Symbol(
  'USER_VALIDATE_CREDENTIALS_SERVICE_PORT',
);
export abstract class UserValidateCredentialsServicePort {
  abstract validate(password: string, hash: string): Promise<boolean>;
  abstract encrypt(password: string): Promise<string>;
}
