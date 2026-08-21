import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { SecurityEvent } from '../../domain/entity/security-event.entity';
import { SecurityEventLoggerPort } from '../port/security-event-logger.port';
import { SecurityEventRepositoryPort } from '../port/security-event-repository.port';

export class CreateSecurityEventUseCase implements BaseUseCase<
  SecurityEvent,
  SecurityEvent
> {
  constructor(
    private readonly securityEventRepository: SecurityEventRepositoryPort,
    private readonly logger: SecurityEventLoggerPort,
  ) {}
  async execute(payload: SecurityEvent): Promise<SecurityEvent> {
    this.logger.log(`Create security event: ${JSON.stringify(payload)}`, {
      context: 'CreateSecurityEventUseCase',
    });
    return await this.securityEventRepository.create(payload);
  }
}
