import { BaseUseCase } from '../../../core/application/use-case/base.use-case';
import { AuthFlow } from '../../domain/enum/auth-flow.enum';
import { EmailServicePort } from '../port/email-service.port';
import { GenerateOtpServicePort } from '../port/generate-otp-service.port';
import { RedisServicePort } from '../port/redisService.port';
import { UserRepositoryPort } from '../port/user-repository.port';

export class ResetPasswordUseCase implements BaseUseCase<string> {
  constructor(
    private readonly userRepositoryPort: UserRepositoryPort,
    private readonly emailServicePort: EmailServicePort,
    private readonly redisServicePort: RedisServicePort,
    private readonly generateOtpServicePort: GenerateOtpServicePort,
  ) {}
  async execute(email: string): Promise<{ message: string }> {
    const userDB = await this.userRepositoryPort.findByEmail(email);
    userDB.isVerifiedAccount(AuthFlow.resetPassword);
    const code = this.generateOtpServicePort.generateOTP();
    await this.redisServicePort.saveResetPasswordCodeOTP(code, email);
    await this.emailServicePort.resetPassword({
      email: email,
      name: userDB.name,
      code: code,
    });

    return { message: 'Recovery Email Sent ' };
  }
}
