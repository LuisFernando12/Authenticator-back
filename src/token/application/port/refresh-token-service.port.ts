export const REFRESH_TOKEN_SERVICE_PORT = Symbol('REFRESH_TOKEN_SERVICE_PORT');

export abstract class RefreshTokenServicePort {
  abstract generateRefreshToken();
  abstract hashRefreshToken(refreshToken: string): string;
}
