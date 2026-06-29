import { DataSource } from 'typeorm';
import { SessionRepositoryImpl } from './../../../session/infrastructure/persistence/repository/session.repository';

import {
  ITokenSessionTransaction,
  TransactionPort,
} from '../../application/port/transaction.port';
import { TokenRepository } from '../repository/token.repository';

export class TransactionAdapter implements TransactionPort {
  constructor(private readonly dataSource: DataSource) {}
  executeTransaction<T>(
    work: (manager: ITokenSessionTransaction) => Promise<T>,
  ): Promise<T> {
    return this.dataSource.transaction((manager) => {
      return work({
        session: new SessionRepositoryImpl(
          manager.getRepository('SessionEntity'),
        ),
        token: new TokenRepository(manager.getRepository('TokenEntity')),
      });
    });
  }
  // async saveTokenAndSessionTransaction(
  //   transactionData: ITokenSessionTransaction,
  // ): Promise<void> {
  //   const { token, session } = transactionData;
  //   await this.dataSource.transaction(async (manager) => {
  //     try {
  //       await manager.getRepository(SessionEntity).save(session);
  //       await manager.getRepository(TokenEntity).save({
  //         userId: token.user.id,
  //         consentId: token.consentId || null,
  //         tokenFamilyId: token.tokenFamilyId,
  //         jti: token.jti,
  //         refreshToken: token.refreshToken,
  //         expiresAt: token.expiresAt,
  //       });
  //     } catch (_error) {
  //       throw TokenDomainError.internalServerError(
  //         'Error to create session or token',
  //       );
  //     }
  //   });
  // }
  // async deleteAllFamilyTokenAndSessionsTransaction(transactionData: {
  //   tokenFamilyId: string;
  // }): Promise<void> {
  //   const { tokenFamilyId } = transactionData;
  //   await this.dataSource.transaction(async (manager) => {
  //     try {
  //       await manager
  //         .getRepository(SessionEntity)
  //         .delete({ tokenFamilyId: tokenFamilyId });
  //       await manager
  //         .getRepository(TokenEntity)
  //         .delete({ tokenFamilyId: tokenFamilyId });
  //     } catch (_error) {
  //       throw TokenDomainError.internalServerError(
  //         'Error to create session or token',
  //       );
  //     }
  //   });
  // }
}
