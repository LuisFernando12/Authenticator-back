import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientController } from '../controller/client.controller';
import { ClientEntity } from '../entity/client.entity';
import { ClientRepository } from '../repository/client.repository';
import { ClientService } from '../service/client.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity])],
  controllers: [ClientController],
  providers: [ClientRepository, ClientService],
  exports: [ClientRepository, ClientService],
})
export class ClientModule {}
