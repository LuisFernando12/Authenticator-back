import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
interface IErrorPayload {
  error: string;
  message: string;
  status: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: IErrorPayload, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status;
    console.log(exception);
    response.status(status).json({
      error: exception.error.toLocaleUpperCase(),
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
