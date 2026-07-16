import { Token } from '@/token/domain/entity/token.entity';
import { ConfigServiceFake } from './config-service-fake';
import { GenerateUUIDFake } from './generate-jti-fake';
import { JwtServiceFake } from './jwt-service-fake';
import { RefreshTokenServiceFake } from './refresh-token-service-fake';
import { SessionRepositoryFake } from './session-repository-fake';
import { TokenRepositoryFake } from './token-repository-fake';
import { TransactionFake } from './trasaction-fake';

export const tokenMocked = () => {
  const tokenRepositoryFake = new TokenRepositoryFake();
  const sessionRepositoryFake = new SessionRepositoryFake();

  return {
    tokenRepositoryFake,
    sessionRepositoryFake,
    configServiceFake: new ConfigServiceFake(),
    jwtServiceFake: new JwtServiceFake(),
    refreshTokenServiceFake: new RefreshTokenServiceFake(),
    generateJtiFake: new GenerateUUIDFake(),
    transactionFake: new TransactionFake(
      sessionRepositoryFake,
      tokenRepositoryFake,
    ),
    mockToken: (token: ConstructorParameters<typeof Token>[0]) =>
      new Token(token),
  };
};

export type TokenMockedType = ReturnType<typeof tokenMocked>;
