import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CONSENT_REPOSITORY_PORT,
  ConsentRepositoryPort,
} from '../../application/port/consent-repository.port';
import {
  ConsentService,
  ConsentServiceImpl,
} from '../../application/service/consent.service';
import { CreateConsentUseCase } from '../../application/use-case/create-consent.use-case';
import { FindByConsentIdUseCase } from '../../application/use-case/find-by-consent-id.use-case';
import { FindByUserIdAndClientIdUseCase } from '../../application/use-case/find-by-user-id-and-client-id.use-case';
import { FindByUserIdUseCase } from '../../application/use-case/find-by-user-id.use-case';
import { ConsentRepositoryAdapter } from '../adapter/consent-repository.adapter';
import { ConsentEntity } from '../persistence/entity/consent.entity';
import { ConsentRepository } from '../repository/consent.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentEntity])],
  providers: [
    ConsentRepository,
    {
      provide: CONSENT_REPOSITORY_PORT,
      useFactory: (
        consentRepository: ConsentRepository,
      ): ConsentRepositoryPort =>
        new ConsentRepositoryAdapter(consentRepository),
      inject: [ConsentRepository],
    },
    {
      provide: CreateConsentUseCase,
      useFactory: (consentRepositoryPort: ConsentRepositoryPort) =>
        new CreateConsentUseCase(consentRepositoryPort),
      inject: [CONSENT_REPOSITORY_PORT],
    },
    {
      provide: FindByConsentIdUseCase,
      useFactory: (consentRepositoryPort: ConsentRepositoryPort) =>
        new FindByConsentIdUseCase(consentRepositoryPort),
      inject: [CONSENT_REPOSITORY_PORT],
    },
    {
      provide: FindByUserIdAndClientIdUseCase,
      useFactory: (consentRepositoryPort: ConsentRepositoryPort) =>
        new FindByUserIdAndClientIdUseCase(consentRepositoryPort),
      inject: [CONSENT_REPOSITORY_PORT],
    },
    {
      provide: FindByUserIdUseCase,
      useFactory: (consentRepositoryPort: ConsentRepositoryPort) =>
        new FindByUserIdUseCase(consentRepositoryPort),
      inject: [CONSENT_REPOSITORY_PORT],
    },
    {
      provide: ConsentService,
      useFactory: (
        createConsentUseCase: CreateConsentUseCase,
        findByConsentIdUseCase: FindByConsentIdUseCase,
        findByUserIdUseCase: FindByUserIdUseCase,
        findByUserIdAndClientIdUseCase: FindByUserIdAndClientIdUseCase,
      ) =>
        new ConsentServiceImpl(
          createConsentUseCase,
          findByConsentIdUseCase,
          findByUserIdUseCase,
          findByUserIdAndClientIdUseCase,
        ),
      inject: [
        CreateConsentUseCase,
        FindByConsentIdUseCase,
        FindByUserIdUseCase,
        FindByUserIdAndClientIdUseCase,
      ],
    },
  ],
  exports: [ConsentService, ConsentRepository],
})
export class ConsentModule {}
