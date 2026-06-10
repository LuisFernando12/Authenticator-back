import { Consent } from '@/consent/domain/entity/consent.entity';
import { ConsentRepositoryFake } from './consent-repository-fake';

export const consentMocked = () => ({
  consentRepositoryFake: new ConsentRepositoryFake(),
  mockConsent: (consent: ConstructorParameters<typeof Consent>[0]) =>
    Consent.create(consent),
});

export type ConsentMockedType = ReturnType<typeof consentMocked>;
