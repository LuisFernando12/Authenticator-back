import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateClientUseCase } from '../../application/use-case/create-client.use-case';
import { FindByClientIdUseCase } from '../../application/use-case/find-by-clientId.use-case';
import { SaveClientDTO } from '../dto/save-client.dto';

export interface IClientController {
  create(client: SaveClientDTO): Promise<any>;
}
@Controller('client')
export class ClientController implements IClientController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly findByClientIdUseCase: FindByClientIdUseCase,
  ) {}
  @Post()
  @ApiBody({ type: SaveClientDTO })
  @ApiResponse({ status: 201, description: 'Client created' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() client: SaveClientDTO) {
    return await this.createClientUseCase.execute(client);
  }
  @Get('client-id/:id')
  @ApiResponse({ status: 200, description: 'Client found' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findByClientId(@Param('id') clientId: string) {
    return await this.findByClientIdUseCase.execute(clientId);
  }
}
