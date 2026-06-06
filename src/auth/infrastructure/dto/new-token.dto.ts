import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewTokenToActiveEmailDTO {
  @IsString()
  @ApiProperty()
  email: string;
}
