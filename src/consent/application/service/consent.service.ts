import { Consent, IConsentProps } from '../../domain/entity/consent.entity';
import { CreateConsentUseCase } from '../use-case/create-consent.use-case';
import { FindByConsentIdUseCase } from '../use-case/find-by-consent-id.use-case';
import { FindByUserIdAndClientIdUseCase } from '../use-case/find-by-user-id-and-client-id.use-case';
import { FindByUserIdUseCase } from '../use-case/find-by-user-id.use-case';
export abstract class ConsentService {
  abstract create(payload: IConsentProps): Promise<void>;
  abstract findByConsentId(consentId: string): Promise<Consent>;
  abstract findByUserId(userId: string): Promise<Consent[]>;
  abstract findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent>;
}

export class ConsentServiceImpl implements ConsentService {
  constructor(
    private readonly createConsentUseCase: CreateConsentUseCase,
    private readonly findByConsentIdUseCase: FindByConsentIdUseCase,
    private readonly findByUserIdUseCase: FindByUserIdUseCase,
    private readonly findByUserIdAndClientIdUseCase: FindByUserIdAndClientIdUseCase,
  ) {}

  async create(payload: IConsentProps): Promise<void> {
    return await this.createConsentUseCase.execute(Consent.create(payload));
  }

  async findByConsentId(consentId: string): Promise<Consent> {
    return await this.findByConsentIdUseCase.execute(consentId);
  }

  async findByUserId(userId: string): Promise<Consent[]> {
    return await this.findByUserIdUseCase.execute(userId);
  }

  async findByUserIdAndClientId(payload: {
    userId: string;
    clientId: string;
  }): Promise<Consent> {
    return await this.findByUserIdAndClientIdUseCase.execute(payload);
  }
}
