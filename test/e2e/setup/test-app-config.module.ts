import { AppConfigEnvService } from '@/service/app-config-env.service.deprecated';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../../../src/client/infrastructure/persistence/entity/client.entity';
import { ConsentEntity } from '../../../src/consent/infrastructure/persistence/entity/consent.entity';
import { TokenEntity } from '../../../src/token/infrastructure/persistence/entity/token.entity';
import { UserEntity } from '../../../src/user/infrastructure/persistence/entity/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST'),
          port: config.get('DB_PORT'),
          username: config.get('DB_USER'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_NAME'),
          entities: [UserEntity, TokenEntity, ClientEntity, ConsentEntity],
          synchronize: true,
        };
      },
    }),
  ],
  providers: [AppConfigEnvService],
  exports: [AppConfigEnvService],
})
export class TestAppConfigModule {}
