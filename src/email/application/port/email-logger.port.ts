import { IBaseLoggerOptions } from '../../../config/logger/base-logger';
export const EMAIL_LOGGER_PORT = Symbol('EMAIL_LOGGER_PORT');

export abstract class EmailLoggerPort {
  abstract log(message: string, options: IBaseLoggerOptions): void;
  abstract error(message: string, options: IBaseLoggerOptions): void;
  abstract warn(message: string, options: IBaseLoggerOptions): void;
}
