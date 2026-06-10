import { StringValue } from '../type/string-value.type';

export const CONFIG_SERVICE_PORT = Symbol('CONFIG_SERVICE_PORT');
export abstract class ConfigServicePort {
  abstract get accessTokenExpiresIn(): StringValue;
  abstract get refreshTokenExpiresDays(): number;
  abstract get secret(): string;
  abstract get emailVerificationTokenExpires(): StringValue;
}
