import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UnblockAccountDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  code: number;
}
