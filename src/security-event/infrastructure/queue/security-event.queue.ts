import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { Inject } from '@nestjs/common';
import {
  SECURITY_EVENT_LOGGER_PORT,
  SecurityEventLoggerPort,
} from '../../application/port/security-event-logger.port';
import { SecurityEvent } from '../../domain/entity/security-event.entity';
import { SecurityDomainError } from '../../domain/error/security-domain.error';

export class SecurityEventQueue {
  constructor(
    @InjectQueue('security-event') private readonly securityEventQueue: Queue,
    @Inject(SECURITY_EVENT_LOGGER_PORT)
    private readonly logger: SecurityEventLoggerPort,
  ) {}

  async add(payload: SecurityEvent) {
    try {
      await this.securityEventQueue.add(payload.type, payload);
    } catch (error: any) {
      this.logger.error('Failure to create security event', {
        errorStack: {
          message: error.message,
          stack: error.stack,
          cause: error.cause,
        },
        context: 'SecurityEventQueue',
      });
      throw SecurityDomainError.internalServerError(
        'Failure to create security event',
      );
    }
  }
  async remove(jobId: string) {
    await this.securityEventQueue.remove(jobId);
  }
}
