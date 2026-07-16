import { Session } from '../../../../../src/session/domain/entity/session.entity';
import {
  ICreateSessionPayload,
  SessionRepositoryPort,
} from '../../../../../src/token/application/port/session-repository.port';

export class SessionRepositoryFake implements SessionRepositoryPort {
  private sessions: Session[] = [
    Session.create({
      id: 'test-session-id',
      jti: 'test-jti',
      userId: 'test-user-id',
      consentId: 'test-consent-id',
      tokenFamilyId: 'test-token-family-id',
      expiresAt: new Date(Date.now() + 3600 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ];

  async create(sessionPayload: ICreateSessionPayload): Promise<any> {
    const session = Session.create({
      id: sessionPayload.id ?? 'test-created-session-id',
      jti: sessionPayload.jti,
      userId: sessionPayload.userId,
      consentId: sessionPayload.consentId ?? null,
      tokenFamilyId: sessionPayload.tokenFamilyId,
      expiresAt: sessionPayload.expiresAt,
      createdAt: sessionPayload.createdAt ?? new Date(),
      updatedAt: sessionPayload.updatedAt ?? new Date(),
    });

    this.sessions.push(session);

    return session;
  }

  async update(
    payload: { newJTI: string; expiresAt: Date },
    oldJTI: string,
  ): Promise<void> {
    const session = this.sessions.some((item) => item.jti === oldJTI);

    if (!session) {
      throw new Error('Session not found');
    }

    this.sessions = this.sessions.map((item) => {
      if (item.jti !== oldJTI) {
        return item;
      }

      return Session.create({
        ...item.toJSON(),
        jti: payload.newJTI,
        expiresAt: payload.expiresAt,
        updatedAt: new Date(),
      });
    });
  }

  async deleteAllByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<void> {
    this.sessions = this.sessions.filter(
      (item) => item.userId !== userId || item.consentId !== consentId,
    );
  }

  async delete(id: string): Promise<void> {
    const sessionExists = this.sessions.some((item) => item.id === id);

    if (!sessionExists) {
      throw new Error('Session not found');
    }

    this.sessions = this.sessions.filter((item) => item.id !== id);
  }

  async deleteByJTI(jti: string): Promise<void> {
    const sessionExists = this.sessions.some((item) => item.jti === jti);

    if (!sessionExists) {
      throw new Error('Session not found');
    }

    this.sessions = this.sessions.filter((item) => item.jti !== jti);
  }

  async deleteByTokenFamilyId(tokenFamilyId: string): Promise<void> {
    const sessionExists = this.sessions.some(
      (item) => item.tokenFamilyId === tokenFamilyId,
    );

    if (!sessionExists) {
      throw new Error('Session not found');
    }

    this.sessions = this.sessions.filter(
      (item) => item.tokenFamilyId !== tokenFamilyId,
    );
  }
}
