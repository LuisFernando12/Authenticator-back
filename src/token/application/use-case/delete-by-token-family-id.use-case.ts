import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { TransactionPort } from '../port/transaction.port';

export class DeleteByTokenFamilyIdUseCase implements BaseUseCase<string, void> {
  constructor(private readonly transactionPort: TransactionPort) {}
  async execute(tokenFamilyId: string): Promise<void> {
    await this.transactionPort.executeTransaction(async (manager) => {
      await manager.token.deleteByTokenFamilyId(tokenFamilyId);
      await manager.session.deleteByTokenFamilyId(tokenFamilyId);
    });
  }
}
