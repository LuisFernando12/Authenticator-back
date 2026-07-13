import { AuthenticatorLogger } from '@/config/logger/auth-logger.config';
import { IBaseLoggerOptions } from '../../../config/logger/base-logger';
import { EmailLoggerPort } from '../../application/port/email-logger.port';

export class EmailLoggerAdapter implements EmailLoggerPort {
  constructor(private readonly logger: AuthenticatorLogger) {}
  log(message: string, options: IBaseLoggerOptions): void {
    this.logger.log(message, { ...options, context: 'EmailDomain' });
  }
  error(message: string, options: IBaseLoggerOptions): void {
    this.logger.error(message, { ...options, context: 'EmailDomain' });
  }
  warn(message: string, options: IBaseLoggerOptions): void {
    this.logger.warn(message, { ...options, context: 'EmailDomain' });
  }
}
