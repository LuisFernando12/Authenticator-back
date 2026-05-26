import * as bcrypt from 'bcrypt';
import { IUserService } from '../../../service/user.service';
import {
  IValidanteCredentialsPayload,
  UserServicePort,
} from '../../application/port/user-service.port';
import { OauthUser } from '../../domain/entity/user.entity';
import { OauthDomainError } from '../../domain/error/oauth-domain.error';

export class UserServiceAdapter implements UserServicePort {
  constructor(private readonly userService: IUserService) {}
  async findByEmail(email: string): Promise<OauthUser> {
    const userDB = await this.userService.findByEmail(email);
    if (!userDB) {
      throw new Error('Invalid credentials');
    }
    return new OauthUser(userDB);
  }
  async validateUserCredentials(
    payload: IValidanteCredentialsPayload,
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
}
