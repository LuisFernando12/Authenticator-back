import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigEnvService {
  constructor(private readonly config: ConfigService) {}

  get hostDB(): string {
    return this.config.get<string>('DB_HOST');
  }
  get userDB(): string {
    return this.config.get<string>('DB_USER');
  }
  get passwordDB(): string {
    return this.config.get<string>('DB_PASSWORD');
  }
  get nameDB(): string {
    return this.config.get<string>('DB_NAME');
  }
  get portDB(): number {
    return this.config.get<number>('DB_PORT');
  }
  get serviceURL(): string {
    return this.config.get<string>('SERVICE_URL');
  }
  get serviceVerifyEmailURL(): string {
    return this.config.get<string>('SERVICE_VERIFY_EMAIL_URL');
  }
  get serviceResetPasswordUrl(): string {
    return this.config.get<string>('SERVICE_RESET_PASSWORD_URL');
  }
  get redirectURI(): string {
    return this.config.get<string>('REDIRECT_URI');
  }
  get secret(): string {
    return this.config.get<string>('SECRET');
  }
  get gmailClientId(): string {
    return this.config.getOrThrow<string>('GMAIL_CLIENT_ID');
  }
  get gmailClientSecret(): string {
    return this.config.getOrThrow<string>('GMAIL_CLIENT_SECRET');
  }
  get gmailRedirectURI(): string {
    return this.config.getOrThrow<string>('GMAIL_REDIRECT_URI');
  }
  get gmailRefreshToken(): string {
    return this.config.getOrThrow<string>('GMAIL_REFRESH_TOKEN');
  }
  get gmailSenderEmail(): string {
    return this.config.getOrThrow<string>('GMAIL_SENDER_EMAIL');
  }
  get oauthLoginURL(): string {
    return this.config.getOrThrow<string>('OAUTH_LOGIN_URL');
  }
  get redisURI(): string {
    return this.config.getOrThrow<string>('REDIS_URI');
  }
  get clientSecretPepper(): string {
    return this.config.getOrThrow<string>('CLIENT_SECRET_PEPPER');
  }
  get accessTokenExpiresIn(): string {
    return this.config.getOrThrow<string>('ACCESS_TOKEN_EXPIRES_IN');
  }
  get refreshTokenExpiresDays(): number {
    return this.config.getOrThrow<number>('REFRESH_TOKEN_EXPIRES_DAYS');
  }
  get emailVerificationTokenExpires(): string {
    return this.config.getOrThrow<string>('EMAIL_VERIFICATION_TOKEN_EXPIRES');
  }
  get nodeEnv(): string {
    return this.config.getOrThrow<string>('NODE_ENV');
  }
}
