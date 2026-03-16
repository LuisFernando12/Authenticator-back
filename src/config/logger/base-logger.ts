import { ConsoleLogger, Injectable } from '@nestjs/common';
export interface IBaseLoggerOptions {
  context: string;
  logLevel: 'log' | 'error' | 'warn' | 'debug';
  writeStreamType?: 'stdout' | 'stderr';
  errorStack?: unknown;
}
export interface IBaseLogger {
  logAsJson(message: string, payload: IBaseLoggerOptions): void;
}
@Injectable()
export class BaseLogger extends ConsoleLogger implements IBaseLogger {
  constructor() {
    super({
      prefix: 'Authenticator',
      timestamp: true,
      logLevels: ['log', 'error', 'warn', 'debug'],
    });
  }
  logAsJson(message: string, payload: IBaseLoggerOptions) {
    if (!payload.writeStreamType) {
      payload['writeStreamType'] = 'stdout';
    }
    this.printAsJson(message, payload as any);
  }
}
