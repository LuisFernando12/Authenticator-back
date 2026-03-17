// biome-ignore lint/style/useImportType: <explanation>
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigEnvService {
  constructor(private readonly config: ConfigService) {}

  get userDB(): string {
    return this.config.get<string>('USER_DB');
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
  get serverSMTP(): string {
    return this.config.get<string>('SERVER_SMTP');
  }
  get smtpPORT(): number {
    return this.config.get<number>('SMTP_PORT');
  }
  get serverSMTPUserName(): string {
    return this.config.get<string>('SERVER_SMTP_USER_NAME');
  }
  get serverSMTPPassword(): string {
    return this.config.get<string>('SERVER_SMTP_PASSWORD');
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
}
