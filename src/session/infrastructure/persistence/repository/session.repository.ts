import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Session } from '../../../domain/entity/session.entity';
import { SessionDomainError } from '../../../domain/error/session-domain.error';
import { SessionEntity, SessionEntityType } from '../entity/session.entity';
export abstract class SessionRepository {
  abstract create(sessionPayload: SessionEntityType): Promise<Session>;
  abstract findByUserId(userId: string): Promise<Session[]>;
  abstract findByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<Session[]>;
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
export class SessionRepositoryImpl implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}
  async create(sessionPayload: SessionEntityType): Promise<Session> {
    try {
      const session = await this.sessionRepository.save(sessionPayload);
      return Session.create(session);
    } catch {
      throw SessionDomainError.internalServerError('Error to create session');
    }
  }
  async findByUserId(userId: string): Promise<Session[]> {
    try {
      const sessions = await this.sessionRepository.find({ where: { userId } });
      return sessions.map(Session.create) || [];
    } catch {
      throw SessionDomainError.internalServerError(
        'Error to find sessions by user',
      );
    }
  }
  async findByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<Session[]> {
    try {
      const session = await this.sessionRepository.findBy({
        userId: userId,
        consentId: consentId,
      });
      return session.map(Session.create) || [];
    } catch {
      throw SessionDomainError.internalServerError(
        'Error to find sessions by user',
      );
    }
  }
  async update(
    payload: { newJTI: string; expiresAt: Date },
    oldJTI: string,
  ): Promise<void> {
    try {
      const sessionDB = await this.sessionRepository.update(
        { jti: oldJTI },
        { jti: payload.newJTI, expiresAt: payload.expiresAt },
      );
      if (sessionDB.affected === 0) {
        throw SessionDomainError.notFound('Failure to update session');
      }
      return;
    } catch (error: any) {
      if (error.status === 404) {
        throw SessionDomainError.notFound('Session not found!');
      }
      throw SessionDomainError.internalServerError('Error to update session');
    }
  }
  async delete(id: string): Promise<void> {
    try {
      const sessionDelete = await this.sessionRepository.delete(id);
      if (sessionDelete.affected === 0) {
        throw SessionDomainError.internalServerError(
          'Failure to delete session',
        );
      }
      return;
    } catch {
      throw SessionDomainError.internalServerError('Error to delete session');
    }
  }
  async deleteAllByUserIdAndConsentId(
    userId: string,
    consentId: string,
  ): Promise<void> {
    try {
      const sessionDelete = await this.sessionRepository.delete({
        userId,
        consentId,
      });
      if (sessionDelete.affected === 0) {
        throw SessionDomainError.internalServerError(
          'Failure to delete session',
        );
      }
      return;
    } catch {
      throw SessionDomainError.internalServerError('Error to delete session');
    }
  }
  async deleteOldestSessionByUserId(
    userId: string,
    consentId: string | null,
  ): Promise<void> {
    try {
      const oldestSession = await this.sessionRepository.findOne({
        order: { createdAt: 'ASC' },
        where: { userId, consentId: consentId || IsNull() },
      });
      const sessionDelete = await this.sessionRepository.delete({
        id: oldestSession.id,
      });
      if (sessionDelete.affected === 0) {
        throw SessionDomainError.internalServerError(
          'Failure to delete oldest session',
        );
      }
      return;
    } catch {
      throw SessionDomainError.internalServerError(
        'Error to delete oldest session',
      );
    }
  }
  async deleteByJTI(jti: string): Promise<void> {
    try {
      const sessionDelete = await this.sessionRepository.delete({ jti: jti });
      if (sessionDelete.affected === 0) {
        throw SessionDomainError.internalServerError(
          'Failure to delete session',
        );
      }
      return;
    } catch {
      throw SessionDomainError.internalServerError(
        'Error to delete session by jti',
      );
    }
  }
  async deleteByTokenFamilyId(tokenFamilyId: string): Promise<void> {
    try {
      const sessionDelete = await this.sessionRepository.softDelete({
        tokenFamilyId: tokenFamilyId,
      });
      if (sessionDelete.affected === 0) {
        throw SessionDomainError.internalServerError(
          'Failure to delete session',
        );
      }
      return;
    } catch {
      throw SessionDomainError.internalServerError(
        'Error to delete session by token family id',
      );
    }
  }
}
