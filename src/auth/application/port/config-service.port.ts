export const CONFIG_SERVICE_PORT = Symbol('CONFIG_SERVICE_PORT');
export abstract class ConfigServicePort {
  abstract get redirectURI(): string;
}
