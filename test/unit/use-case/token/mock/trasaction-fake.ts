import {
  ITokenSessionTransaction,
  TransactionPort,
} from '../../../../../src/token/application/port/transaction.port';
import { SessionRepositoryFake } from './session-repository-fake';
import { TokenRepositoryFake } from './token-repository-fake';

export class TransactionFake implements TransactionPort {
  constructor(
    private readonly sessionRepositoryFake = new SessionRepositoryFake(),
    private readonly tokenRepositoryFake = new TokenRepositoryFake(),
  ) {}

  async executeTransaction<T>(
    work: (manager: ITokenSessionTransaction) => Promise<T>,
  ): Promise<T> {
    return work({
      session: this.sessionRepositoryFake,
      token: this.tokenRepositoryFake,
    });
  }
}
