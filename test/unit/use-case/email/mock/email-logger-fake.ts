import { IBaseLoggerOptions } from '@/config/logger/base-logger';
import { EmailLoggerPort } from '@/email/application/port/email-logger.port';

export class EmailLoggerFake implements EmailLoggerPort {
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
