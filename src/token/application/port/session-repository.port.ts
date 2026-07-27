export interface ICreateSessionPayload {
  consentId: string;
  jti: string;
  tokenFamilyId: string;
  expiresAt: Date;
  userId: string;
  deletedAt?: Date;
}
/**
 * type SessionEntityType = {
 consentId: string;
 jti: string;
 tokenFamilyId: string;
 expiresAt: Date;
 userId: string;
 deletedAt?: Date;
}
 */
export interface ISession {
  id: string;
  jti: string;
  userId: string;
  consentId: string | null;
  tokenFamilyId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt?: Date;
}
export const SESSION_REPOSITORY_PORT = Symbol('SESSION_REPOSITORY_PORT');
export abstract class SessionRepositoryPort {
  abstract create(sessionPayload: ICreateSessionPayload): Promise<ISession>;
  abstract findByUserId(userId: string): Promise<ISession[]>;

  abstract findByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<ISession[]>;
  abstract update(
    payload: { newJTI: string; expiresAt: Date },
    oldJTI: string,
  ): Promise<void>;
  abstract deleteAllByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract deleteOldestSessionByUserId(
    userId: string,
    consentId: string | null,
  ): Promise<void>;
  abstract deleteByJTI(jti: string): Promise<void>;
  abstract deleteByTokenFamilyId(tokenFamilyId: string): Promise<void>;
}
