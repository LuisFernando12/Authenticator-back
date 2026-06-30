import { Inject, Injectable } from '@nestjs/common';
import { BaseLogger, IBaseLoggerOptions } from './base-logger';

export interface IAuthLogger {
  log(message: string, options: IBaseLoggerOptions): void;
  error(message: string, options: IBaseLoggerOptions): void;
  warn(message: string, options: IBaseLoggerOptions): void;
  debug(message: string, options: IBaseLoggerOptions): void;
}

@Injectable()
export class AuthLogger implements IAuthLogger {
  constructor(@Inject(BaseLogger) private readonly baseLogger: BaseLogger) {}

  log(message: string, options: Omit<IBaseLoggerOptions, 'logLevel'>) {
    options['logLevel'] = 'log';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
  error(message: string, options: Omit<IBaseLoggerOptions, 'logLevel'>) {
    options['logLevel'] = 'error';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
  warn(message: string, options: Omit<IBaseLoggerOptions, 'logLevel'>) {
    options['logLevel'] = 'warn';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
  debug(message: string, options: Omit<IBaseLoggerOptions, 'logLevel'>) {
    options['logLevel'] = 'debug';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
}
