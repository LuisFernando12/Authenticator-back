import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  SECURITY_EVENT_LOGGER_PORT,
  SecurityEventLoggerPort,
} from '../../application/port/security-event-logger.port';
import { SecurityEvent } from '../../domain/entity/security-event.entity';
import { SecurityEventService } from '../service/security-event.service';

@Processor('security-event')
export class SecurityEventWorker extends WorkerHost {
  constructor(
    @Inject(SecurityEventService)
    private readonly securityEventService: SecurityEventService,
    @Inject(SECURITY_EVENT_LOGGER_PORT)
    private readonly logger: SecurityEventLoggerPort,
  ) {
    super();
    this.logger.log('SecurityEventWorker created', {
      context: 'SecurityEventWorker',
    });
  }
  async process(job: Job<SecurityEvent>): Promise<any> {
    try {
      this.logger.log(`Processing security event job type:${job.name}`, {});
      await this.securityEventService.create(job.data);
      this.logger.log(`Completed processing job with jobId: ${job.id}`, {});
    } catch (error: any) {
      this.logger.error(`Failed processing job with jobId: ${job.id}`, {
        errorStack: {
          message: error.message,
          stack: error.stack,
        },
        context: 'SecurityEventWorker',
      });
      throw error;
    }
  }
}
