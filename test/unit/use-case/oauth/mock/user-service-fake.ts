import {
  IValidanteCredentialsPayload,
  UserServicePort,
} from '@/oauth/application/port/user-service.port';
import { OauthUser } from '../../../../../src/oauth/domain/entity/user.entity';

export class UserServiceFake implements UserServicePort {
  private user: OauthUser = jest.fn().mockResolvedValue({
    id: 'test-user-id',
    email: 'test-user-email',
    password: 'test-user-password',
    name: 'test-user-name',
    isVerified: true,
    createdAt: new Date(),
  }) as any;
  async findByEmail(_email: string): Promise<OauthUser> {
    return this.user;
  }
  async validateUserCredentials(
    _payload: IValidanteCredentialsPayload,
  ): Promise<OauthUser> {
    return this.user;
  }
}
