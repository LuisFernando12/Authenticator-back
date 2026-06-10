import { User } from '@/user/domain/entity/user.entity';
import { EmailServiceFake } from './email-service-fake';
import { EncryptServiceFake } from './encrypt-service-fake';
import { TokenServiceFake } from './token-service-fake';
import { UserRepositoryFake } from './user-repository-fake';

export const userMocked = () => ({
  userRepositoryFake: new UserRepositoryFake(),
  encryptServiceFake: new EncryptServiceFake(),
  emailServiceFake: new EmailServiceFake(),
  tokenServiceFake: new TokenServiceFake(),
  mockUser: (user: ConstructorParameters<typeof User>[0]) => new User(user),
});

export type UserMockedType = ReturnType<typeof userMocked>;
