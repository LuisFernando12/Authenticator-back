import { AuthenticatorLogger } from '../../../config/logger/auth-logger.config';
import { IBaseLoggerOptions } from '../../../config/logger/base-logger';
import { SecurityEventLoggerPort } from '../../application/port/security-event-logger.port';

export class SecurityEventLoggerAdapter implements SecurityEventLoggerPort {
  constructor(private readonly authenticatorLogger: AuthenticatorLogger) {}
  log(message: string, options: IBaseLoggerOptions): void {
    this.authenticatorLogger.log(message, {
      ...options,
      context: options.context ?? 'SecurityEventDomain',
    });
  }
  error(message: string, options: IBaseLoggerOptions): void {
    this.authenticatorLogger.error(message, {
      ...options,
      context: options.context ?? 'SecurityEventDomain',
    });
  }
  warn(message: string, options: IBaseLoggerOptions): void {
    this.authenticatorLogger.warn(message, {
      ...options,
      context: options.context ?? 'SecurityEventDomain',
    });
  }
}
