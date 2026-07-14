export const CONFIG_SERVICE_PORT = Symbol('CONFIG_SERVICE_PORT');
export abstract class ConfigServicePort {
  abstract get serviceVerifyEmailURL(): string;
  abstract get serviceResetPasswordUrl(): string;
}
