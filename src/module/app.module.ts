import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from 'src/entity/token.entity';
import { UserEntity } from 'src/entity/user.entity';
import { ClientEntity } from '../entity/client.entity';
import { AppConfigModule } from './app-config.module';
import { AuthModule } from './auth.module';
import { ClientModule } from './client.module';
import { EmailModule } from './email.module';
import { OauthModule } from './oauth.module';
import { TokenModule } from './token.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        port: config.get('DB_PORT'),
        username: config.get('USER_DB'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [UserEntity, TokenEntity, ClientEntity],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    TokenModule,
    EmailModule,
    ClientModule,
    OauthModule,
  ],
})
export class AppModule {}
