import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SaveClientDTO {
  @IsString()
  @ApiProperty()
  name: string;
  @IsArray()
  @ApiProperty()
  redirectUris: Array<string>;
  @IsArray()
  @ApiProperty()
  grantTypes: Array<string>;
  @IsArray()
  @ApiProperty()
  scopes: Array<string>;
}
