import { SessionRepositoryPort } from './session-repository.port';
import { TokenRepositoryPort } from './token-repository.port';

export interface ITokenSessionTransaction {
  session: SessionRepositoryPort;
  token: TokenRepositoryPort;
}
export const TRANSACTION_PORT = Symbol('TRANSACTION_PORT');
export abstract class TransactionPort {
  abstract executeTransaction<T>(
    work: (manager: ITokenSessionTransaction) => Promise<T>,
  ): Promise<T>;
}
