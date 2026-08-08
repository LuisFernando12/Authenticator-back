export const TEMP_PASSWORD_SERVICE_PORT = Symbol('TEMP_PASSWORD_SERVICE_PORT');
export abstract class TempPasswordServicePort {
  abstract password(): string;
  abstract hashPassword(password: string): Promise<string>;
}
