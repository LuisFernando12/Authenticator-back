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
}
