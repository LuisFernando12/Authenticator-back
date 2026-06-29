export const SESSION_REPOSITORY_PORT = Symbol('SESSION_REPOSITORY_PORT');
export abstract class SessionRepositoryPort {
  abstract create(sessionPayload: any): Promise<any>;
  abstract update(
    payload: { newJTI: string; expiresAt: Date },
    oldJTI: string,
  ): Promise<void>;
  abstract deleteAllByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract deleteByJTI(jti: string): Promise<void>;
  abstract deleteByTokenFamilyId(tokenFamilyId: string): Promise<void>;
}
