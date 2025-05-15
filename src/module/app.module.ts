import { Module } from '@nestjs/common';
import { AuthModule } from './auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './app-config.module';
import { UserModule } from './user.module';
import { UserEntity } from 'src/entity/user.entity';
import { EmailModule } from './email.module';
import { TokenEntity } from 'src/entity/token.entity';
import { TokenModule } from './token.module';

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
        entities: [UserEntity, TokenEntity],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    TokenModule,
    EmailModule,
  ],
})
export class AppModule {}
