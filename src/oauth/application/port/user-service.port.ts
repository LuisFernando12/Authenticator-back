import { OauthUser } from '../../domain/entity/user.entity';

export interface IValidateCredentialsPayload {
  email: string;
  password: string;
}

export const USER_SERVICE_PORT = Symbol('USER_SERVICE_PORT');
export abstract class UserServicePort {
  abstract findByEmail(email: string): Promise<OauthUser>;
  abstract validateUserCredentials(
    payload: IValidateCredentialsPayload,
  ): Promise<OauthUser>;
  abstract isValidEmail(email: string): Promise<boolean>;
  abstract blockAccount(email: string): Promise<void>;
}
