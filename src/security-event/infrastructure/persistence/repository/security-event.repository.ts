import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityEvent } from '../../../domain/entity/security-event.entity';
import { SecurityDomainError } from '../../../domain/error/security-domain.error';
import { SecurityEventEntity } from '../entity/security.entity';

export abstract class SecurityEventRepository {
  abstract create(securityEvent: SecurityEvent): Promise<SecurityEventEntity>;
  abstract findAll(): Promise<SecurityEventEntity[]>;
}
export class SecurityEventRepositoryImpl implements SecurityEventRepository {
  constructor(
    @InjectRepository(SecurityEventEntity)
    private readonly securityEventRepository: Repository<SecurityEventEntity>,
  ) {}
  async create(securityEvent: SecurityEvent): Promise<SecurityEventEntity> {
    try {
      return await this.securityEventRepository.save(securityEvent);
    } catch {
      throw SecurityDomainError.internalServerError(
        'Error to create security event, try again',
      );
    }
  }
  async findAll(): Promise<SecurityEventEntity[]> {
    return await this.securityEventRepository.find();
  }
}
