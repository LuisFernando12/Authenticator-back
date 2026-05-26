export const CONFIG_SERVICE_PORT = Symbol('CONFIG_SERVICE_PORT');
export abstract class ConfigServicePort {
  abstract get serviceURL(): string;
  abstract get clientSecretPepper(): string;
  abstract get oauthLoginURL(): string;
}
