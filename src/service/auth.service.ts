import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
import { EmailService } from './email.service';
import { RedisService } from './redis.service';
export interface IAuthService {
  login: (email: string, password: string) => any;
  verifyEmail(email: string): Promise<{ message: string }>;
  resetPassword(email: string): Promise<{ message: string }>;
  newPassword(
    password: string,
    code: number,
    email: string,
  ): Promise<{ message: string }>;

  // oauth: () => void;
  // callback: () => void;
}
@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}
  async login(email: string, password: string) {
    const userDB = await this.userRepository.findByEmail(email);
    if (!userDB) {
      throw new UnauthorizedException(
        'Email or Password incorrect, please verify and try again',
      );
    }
    const isMatchedPassword = await bcrypt.compare(password, userDB.password);
    if (!isMatchedPassword) {
      throw new UnauthorizedException(
        'Email or Password incorrect, please verify and try again',
      );
    }
    if (!userDB.isVerified) {
      throw new UnauthorizedException(
        'Please verify your email and active your account',
      );
    }
    const token = await this.tokenService.generateToken({
      sub: userDB.id,
      username: userDB.email,
    });
    return {
      token,
      redirect_url: 'https://google.com.br',
    };
  }
  async verifyEmail(email: string) {
    const activeAccountResponse =
      await this.userRepository.activeAccount(email);
    if (!activeAccountResponse.affected) {
      throw new BadRequestException('Failure to activate account');
    }
    return { message: 'Account activated successfully' };
  }
  async resetPassword(email: string): Promise<{ message: string }> {
    const userDB = await this.userRepository.findByEmail(email);
    if (!userDB) {
      throw new NotFoundException('User not found');
    }

    const code = Math.floor(Math.random() * 999999);
    this.redisService.set(`reset-password-${email}`, code, 'EX', 600);
    const emailSend = await this.emailService.resetPassword(
      email,
      userDB.name,
      code,
    );

    if (emailSend !== 'OK') {
      throw new InternalServerErrorException(
        'Failure to reset password, try again',
      );
    }
    return { message: 'Email de recuperação enviado' };
  }
  async newPassword(
    password: string,
    code: number,
    email: string,
  ): Promise<{ message: string }> {
    const codeRedis = Number(
      await this.redisService.get(`reset-password-${email}`),
    );
    if (code !== codeRedis) {
      throw new ForbiddenException('Invalid code !');
    }
    const userDB = await this.userRepository.updatePassword(email, password);
    if (!userDB.affected) {
      throw new InternalServerErrorException('Failure to update password');
    }
    await this.redisService.del(`reset-password-${email}`);
    return { message: 'Updated password' };
  }
}
