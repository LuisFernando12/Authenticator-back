import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { SaveClientDTO } from '../dto/save-client.dto';
import { ClientService } from '../service/client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}
  @Post()
  @ApiBody({ type: SaveClientDTO })
  @ApiResponse({ status: 201, description: 'Client created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() client: SaveClientDTO) {
    return await this.clientService.create(client);
  }
}
