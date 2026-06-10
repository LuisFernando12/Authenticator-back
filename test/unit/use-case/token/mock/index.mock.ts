import { Token } from '@/token/domain/entity/token.entity';
import { ConfigServiceFake } from './config-service-fake';
import { GenerateJtiFake } from './generate-jti-fake';
import { JwtServiceFake } from './jwt-service-fake';
import { RefreshTokenServiceFake } from './refresh-token-service-fake';
import { TokenRepositoryFake } from './token-repository-fake';

export const tokenMocked = () => ({
  tokenRepositoryFake: new TokenRepositoryFake(),
  configServiceFake: new ConfigServiceFake(),
  jwtServiceFake: new JwtServiceFake(),
  refreshTokenServiceFake: new RefreshTokenServiceFake(),
  generateJtiFake: new GenerateJtiFake(),
  mockToken: (token: ConstructorParameters<typeof Token>[0]) =>
    new Token(token),
});

export type TokenMockedType = ReturnType<typeof tokenMocked>;
