import { OauthClient } from '@/oauth/domain/entity/oauth-client.entity';
import { OauthToken } from '@/oauth/domain/entity/oauth-token.entity';
import { ClientServiceFake } from './client-service.fake';
import { ConfigServiceFake } from './config-service-fake';
import { ConsentServiceFake } from './consent-service-fake';
import { GenerateIdServiceFake } from './generate-id-service-fake';
import { HashedClientSecretFake } from './hashed-client-secret-fake';
import { RedisServiceFake } from './redis-service-fake';
import { TokenServiceFake } from './token-service-fake';
import { UserServiceFake } from './user-service-fake';

export const oauthMocked = () => ({
  client: new ClientServiceFake(),
  generateIdServiceFake: new GenerateIdServiceFake(),
  redisServiceFake: new RedisServiceFake(),
  configServiceFake: new ConfigServiceFake(),
  consentServiceFake: new ConsentServiceFake(),
  userServiceFake: new UserServiceFake(),
  tokenServiceFake: new TokenServiceFake(),
  hashedClientSecretServiceFake: new HashedClientSecretFake(),
  mockOauthClient: (oauthClient: OauthClient) => new OauthClient(oauthClient),
  mockOauthToken: (oauthToken: OauthToken) => new OauthToken(oauthToken),
});
export type OauthMockedType = ReturnType<typeof oauthMocked>;
