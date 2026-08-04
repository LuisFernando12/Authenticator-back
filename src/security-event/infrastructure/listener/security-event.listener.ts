import { Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  SECURITY_EVENT_LOGGER_PORT,
  SecurityEventLoggerPort,
} from '../../application/port/security-event-logger.port';
import { SecurityEvent } from '../../domain/entity/security-event.entity';
import { SecurityDomainError } from '../../domain/error/security-domain.error';
import { SecurityEventQueue } from '../queue/security-event.queue';

export class SecurityEventListener {
  constructor(
    private readonly securityEventQueue: SecurityEventQueue,
    @Inject(SECURITY_EVENT_LOGGER_PORT)
    private readonly logger: SecurityEventLoggerPort,
  ) {
    this.logger.log('SecurityEventListener created', {
      context: 'SecurityEventListener',
    });
  }
  @OnEvent('security-event.suspicious', { async: true })
  async handleSecurityEvent(payload: SecurityEvent) {
    try {
      this.logger.log(`Create security event: ${JSON.stringify(payload)}`, {});

      await this.securityEventQueue.add(payload);
    } catch (error: any) {
      this.logger.error('Error to create security event', {
        errorStack: {
          message: error.message,
          stack: error.stack,
        },
        context: 'SecurityEventListener',
      });
      throw SecurityDomainError.internalServerError(
        'Error to create security event',
      );
    }
  }
}
