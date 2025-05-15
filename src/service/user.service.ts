import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { UserEntityType } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { EmailService } from './email.service';
import * as bcrypt from 'bcrypt';
import { TokenService } from './token.service';
export interface IUserService {
  register: (user: UserEntityType) => Promise<string>;
}
@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
  async register(user: UserEntityType) {
    user.password = await this.encryptPassword(user.password);
    const userDB = await this.userRepository.create(user);
    if (!userDB.email) {
      throw new InternalServerErrorException('failed user resgiter');
    }
    try {
      // TODO: Verificar qual a melhor forma de construir esse token para substituir o email
      const verification_token = await this.tokenService.generateToken({
        sub: userDB.id,
        username: userDB.email,
        type: 'verify-email',
      });
      const emailResponse = await this.emailService.sendActivationEmail(
        userDB.email,
        userDB.name,
        verification_token,
      );
      return emailResponse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
