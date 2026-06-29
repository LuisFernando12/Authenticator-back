import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { TransactionPort } from '../port/transaction.port';

export class RevokeTokenUseCase implements BaseUseCase<string> {
  constructor(private readonly transactionPort: TransactionPort) {}
  async execute(token: string): Promise<{ message: string }> {
    await this.transactionPort.executeTransaction(async (manager) => {
      const tokenDB = await manager.token.findByRefreshToken(token);
      await Promise.all([
        manager.token.deleteToken(token),
        manager.session.deleteByJTI(tokenDB.jti),
      ]);
    });
    return { message: 'Token revoked' };
  }
}
