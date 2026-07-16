export interface ICreateSessionPayload {
  id?: string;
  consentId: string;
  jti: string;
  tokenFamilyId: string;
  expiresAt: Date;
  userId: string;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
export const SESSION_REPOSITORY_PORT = Symbol('SESSION_REPOSITORY_PORT');
export abstract class SessionRepositoryPort {
  abstract create(sessionPayload: ICreateSessionPayload): Promise<any>;
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
