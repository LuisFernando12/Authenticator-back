import { AuthUser } from '@/auth/domain/entity/auth-user.entity';
import { AuthToken } from '@/auth/domain/entity/auth-token.entity';
import { ConfigServiceFake } from './config-service-fake';
import { EmailServiceFake } from './email-service-fake';
import { GenerateOtpServiceFake } from './generate-otp-service-fake';
import { RedisServiceFake } from './redis-service-fake';
import { TokenServiceFake } from './token-service-fake';
import { UserRepositoryFake } from './user-repository-fake';
import { UserValidateCredentialsServiceFake } from './user-validate-credentials-service-fake';

export const authMocked = () => ({
  userRepositoryFake: new UserRepositoryFake(),
  userValidateCredentialsServiceFake: new UserValidateCredentialsServiceFake(),
  tokenServiceFake: new TokenServiceFake(),
  configServiceFake: new ConfigServiceFake(),
  emailServiceFake: new EmailServiceFake(),
  redisServiceFake: new RedisServiceFake(),
  generateOtpServiceFake: new GenerateOtpServiceFake(),
  mockAuthUser: (authUser: ConstructorParameters<typeof AuthUser>[0]) =>
    new AuthUser(authUser),
  mockAuthToken: (authToken: ConstructorParameters<typeof AuthToken>[0]) =>
    new AuthToken(authToken),
});

export type AuthMockedType = ReturnType<typeof authMocked>;
