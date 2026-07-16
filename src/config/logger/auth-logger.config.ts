import { Inject, Injectable } from '@nestjs/common';
import { BaseLogger, IBaseLoggerOptions } from './base-logger';

export interface IAuthenticatorLogger {
  log(message: string, options: IBaseLoggerOptions): void;
  error(message: string, options: IBaseLoggerOptions): void;
  warn(message: string, options: IBaseLoggerOptions): void;
  debug(message: string, options: IBaseLoggerOptions): void;
}

@Injectable()
export class AuthenticatorLogger implements IAuthenticatorLogger {
  constructor(@Inject(BaseLogger) private readonly baseLogger: BaseLogger) {
    this.baseLogger.setContext('Authenticator');
  }

  log(message: string, options: IBaseLoggerOptions) {
    options.logLevel = 'log';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
  error(message: string, options: IBaseLoggerOptions) {
    options.logLevel = 'error';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
  warn(message: string, options: IBaseLoggerOptions) {
    options.logLevel = 'warn';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
  debug(message: string, options: IBaseLoggerOptions) {
    options.logLevel = 'debug';
    this.baseLogger.logAsJson(message, options as IBaseLoggerOptions);
  }
}
