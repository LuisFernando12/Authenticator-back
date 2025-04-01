import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { UserEntityType } from 'src/entity/user.entity';
import { UserRepository } from 'src/repository/user.repository';
import { EmailService } from './email.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
export interface IUserService {
  register: (user: UserEntityType) => Promise<string>;
}
@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private jtwService: JwtService,
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
      const emailResponse = await this.emailService.sendActivationEmail(
        userDB.email,
        userDB.name,
      );
      return emailResponse;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
