export const USER_CLIENT_CONSENT_SERVICE_PORT = Symbol(
  'USER_CLIENT_CONSENT_SERVICE',
);
export abstract class UserClientConsentServicePort {
  abstract findByConsentId(consentId: string);
  abstract findConsentByUserIdAndClientId(userId: string, clientId: string);
  abstract findOrCreateConsent(userId: string, clientId: string, scope: string);
}
