import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RevokeTokenDTO {
  @ApiProperty()
  @IsString()
  token: string;
}
export class TokenIntrospectDTO {
  @ApiProperty()
  @IsString()
  token: string;
}
