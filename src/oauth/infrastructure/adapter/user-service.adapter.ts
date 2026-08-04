import { IUserRepository } from '@/user/infrastructure/repository/user.repository';
import * as bcrypt from 'bcrypt';
import {
  IValidateCredentialsPayload,
  UserServicePort,
} from '../../application/port/user-service.port';
import { OauthUser } from '../../domain/entity/user.entity';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class UserServiceAdapter implements UserServicePort {
  constructor(private readonly userRepository: IUserRepository) {}
  async findByEmail(email: string): Promise<OauthUser> {
    const userDB = await this.userRepository.findByEmail(email);
    if (!userDB) {
      throw OauthDomainError.unauthorizedClient('Invalid credentials');
    }
    return new OauthUser(userDB);
  }
  async validateUserCredentials(
    payload: IValidateCredentialsPayload,
  ): Promise<OauthUser> {
    const { password, email } = payload;
    const userDB = await this.findByEmail(email);
    const isMatchedPassword = await bcrypt.compare(password, userDB.password);

    if (!isMatchedPassword) {
      throw OauthDomainError.unauthorizedClient('Invalid credentials');
    }

    if (!userDB.isVerified) {
      throw OauthDomainError.invalidRequest(
        'Please verify your email and active your account',
      );
    }
    return userDB;
  }
  async isValidEmail(email: string): Promise<boolean> {
    const userDB = await this.userRepository.existsUser(email);
    return userDB;
  }
}
