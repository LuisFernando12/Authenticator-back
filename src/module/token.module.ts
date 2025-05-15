import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from 'src/entity/token.entity';
import { TokenRepository } from 'src/repository/token.repository';
import { TokenService } from 'src/service/token.service';
import { AppConfigModule } from './app-config.module';
import { AppConfigEnvService } from 'src/service/app-config-env.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigEnvService],
      useFactory: (config: AppConfigEnvService) => ({
        global: true,
        secret: config.secret,
        signOptions: {
          expiresIn: '60s',
        },
      }),
    }),
    TypeOrmModule.forFeature([TokenEntity]),
  ],
  providers: [TokenService, TokenRepository, AppConfigEnvService],
  exports: [TokenService, TokenRepository, JwtModule],
})
export class TokenModule {}
