import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export interface IContextClient {
  useAgent: string;
  ip: string;
}
export const IContextClient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return {
      useAgent: request.headers['user-agent'],
      ip: request.ip,
    };
  },
);
