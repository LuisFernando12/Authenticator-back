import { Body, Controller, Post } from '@nestjs/common';
import { SaveClientDTO } from '../dto/save-client.dto';
import { ClientService } from '../service/client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Post()
  async create(@Body() client: SaveClientDTO) {
    return await this.clientService.create(client);
  }
}
