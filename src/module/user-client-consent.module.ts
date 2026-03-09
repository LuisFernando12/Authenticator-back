import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserClientConsentEntity } from '../entity/user-client-consent.entity';
import { UserClientConsentRepository } from '../repository/user-client-consent.repository';
import { UserClientConsentService } from '../service/user-client-consent.service';
@Module({
  imports: [TypeOrmModule.forFeature([UserClientConsentEntity])],
  providers: [UserClientConsentService, UserClientConsentRepository],
  exports: [UserClientConsentService, UserClientConsentRepository],
})
export class UserClientConsentModule {}
