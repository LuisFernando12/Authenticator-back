import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SessionEntity } from '../persistence/entity/session.entity';
import { SessionRepositoryImpl } from '../persistence/repository/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    {
      provide: 'SESSION_REPOSITORY',
      useClass: SessionRepositoryImpl,
    },
  ],
})
export class SessionModule {}
