import { IBaseLoggerOptions } from '@/config/logger/base-logger';
import { SecurityEventLoggerPort } from '@/security-event/application/port/security-event-logger.port';

export class SecurityEventLoggerFake implements SecurityEventLoggerPort {
  log(_message: string, _options: IBaseLoggerOptions): void {
    return;
  }

  error(_message: string, _options: IBaseLoggerOptions): void {
    return;
  }

  warn(_message: string, _options: IBaseLoggerOptions): void {
    return;
  }
}
