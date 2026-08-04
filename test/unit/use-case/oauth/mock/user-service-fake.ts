import {
  IValidateCredentialsPayload,
  UserServicePort,
} from '@/oauth/application/port/user-service.port';
import { OauthUser } from '../../../../../src/oauth/domain/entity/user.entity';

export class UserServiceFake implements UserServicePort {
  private readonly user: OauthUser = new OauthUser({
    id: 'test-user-id',
    email: 'john.doe@example.com',
    password: 'test-user-password',
    name: 'test-user-name',
    isVerified: true,
    createdAt: new Date(),
  }) as any;
  async findByEmail(email: string): Promise<OauthUser> {
    if (email !== this.user.email) {
      throw new Error('Invalid email');
    }
    return this.user;
  }
  async validateUserCredentials(
    _payload: IValidateCredentialsPayload,
  ): Promise<OauthUser> {
    return this.user;
  }
  isValidEmail(email: string): Promise<boolean> {
    if (email !== this.user.email) {
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }
}
