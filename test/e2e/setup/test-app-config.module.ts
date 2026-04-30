import { AppConfigEnvService } from '@/service/app-config-env.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from '../../../src/entity/client.entity';
import { TokenEntity } from '../../../src/entity/token.entity';
import { UserClientConsentEntity } from '../../../src/entity/user-client-consent.entity';
import { UserEntity } from '../../../src/entity/user.entity';

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
          entities: [
            UserEntity,
            TokenEntity,
            ClientEntity,
            UserClientConsentEntity,
          ],
          synchronize: true,
        };
      },
    }),
  ],
  providers: [AppConfigEnvService],
  exports: [AppConfigEnvService],
})
export class TestAppConfigModule {}
