import { IBaseLoggerOptions } from '../../../config/logger/base-logger';

export const SECURITY_EVENT_LOGGER_PORT = Symbol('SECURITY_EVENT_LOGGER_PORT');
export abstract class SecurityEventLoggerPort {
  abstract log(message: string, options: IBaseLoggerOptions): void;
  abstract error(message: string, options: IBaseLoggerOptions): void;
  abstract warn(message: string, options: IBaseLoggerOptions): void;
}
