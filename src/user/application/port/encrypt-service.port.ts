export const ENCRYPT_SERVICE_PORT = Symbol('ENCRYPT_SERVICE_PORT');
export abstract class EncryptServicePort {
  abstract encrypt(password: string): Promise<string>;
}
