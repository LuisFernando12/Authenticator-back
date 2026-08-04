import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticatorLogger } from '../../../config/logger/auth-logger.config';
import { AppConfigEnvService } from '../../../core/domain/service/app-config-env.service';
import {
  SECURITY_EVENT_LOGGER_PORT,
  SecurityEventLoggerPort,
} from '../../application/port/security-event-logger.port';
import {
  SECURITY_EVENT_REPOSITORY_PORT,
  SecurityEventRepositoryPort,
} from '../../application/port/security-event-repository.port';
import { CreateSecurityEventUseCase } from '../../application/use-cases/create-security-event.use-case';
import { SecurityEventLoggerAdapter } from '../adapter/security-event-logger.adapter';
import { SecurityEventRepositoryAdapter } from '../adapter/security-event-repository.adapter';
import { SecurityEventListener } from '../listener/security-event.listener';
import { SecurityEventEntity } from '../persistence/entity/security.entity';
import {
  SecurityEventRepository,
  SecurityEventRepositoryImpl,
} from '../persistence/repository/security-event.repository';
import { SecurityEventQueue } from '../queue/security-event.queue';
import {
  SecurityEventService,
  SecurityEventServiceImpl,
} from '../service/security-event.service';
import { SecurityEventWorker } from '../worker/security-event.worker';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecurityEventEntity]),
    BullModule.forRootAsync({
      useFactory: (config: AppConfigEnvService) => {
        const redisURI = config.redisURI;
        if (!redisURI) {
          throw new Error('REDIS_URI is required for bullmq');
        }
        const redisUrl = new URL(redisURI);
        const redisHost = redisUrl.hostname;
        const redisPort = redisUrl.port;
        const redisPassword = redisUrl.password;
        return {
          connection: {
            host: redisHost,
            port: Number(redisPort) || 6379,
            password: redisPassword,
          },
        };
      },
      inject: [AppConfigEnvService],
    }),
    BullModule.registerQueue({
      name: 'security-event',
    }),
    EventEmitterModule.forRoot(),
  ],
  providers: [
    {
      provide: SecurityEventRepository,
      useClass: SecurityEventRepositoryImpl,
    },
    {
      provide: SECURITY_EVENT_LOGGER_PORT,
      useFactory: (
        authenticatorLogger: AuthenticatorLogger,
      ): SecurityEventLoggerPort =>
        new SecurityEventLoggerAdapter(authenticatorLogger),
      inject: [AuthenticatorLogger],
    },
    {
      provide: SECURITY_EVENT_REPOSITORY_PORT,
      useFactory: (
        securityEventRepository: SecurityEventRepository,
      ): SecurityEventRepositoryPort =>
        new SecurityEventRepositoryAdapter(securityEventRepository),
      inject: [SecurityEventRepository],
    },
    {
      provide: CreateSecurityEventUseCase,
      useFactory: (
        securityEventRepositoryPort: SecurityEventRepositoryPort,
        logger: SecurityEventLoggerPort,
      ) => new CreateSecurityEventUseCase(securityEventRepositoryPort, logger),
      inject: [SECURITY_EVENT_REPOSITORY_PORT, SECURITY_EVENT_LOGGER_PORT],
    },
    {
      provide: SecurityEventService,
      useFactory: (createSecurityEventUseCase: CreateSecurityEventUseCase) =>
        new SecurityEventServiceImpl(createSecurityEventUseCase),
      inject: [CreateSecurityEventUseCase],
    },
    SecurityEventWorker,
    SecurityEventQueue,
    SecurityEventListener,
  ],
  exports: [],
})
export class SecurityEventModule {}
