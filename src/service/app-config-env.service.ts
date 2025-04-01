// biome-ignore lint/style/useImportType: <explanation>
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

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
  get serviceResetPasswordUrl(): string {
    return this.config.get<string>('SERVICE_RESET_PASSWORD_URL');
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
}
