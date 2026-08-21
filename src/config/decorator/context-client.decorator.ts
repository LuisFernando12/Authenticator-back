import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export interface IContextClient {
  userAgent: string;
  ip: string;
}
export const ContextClient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return {
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    };
  },
);
