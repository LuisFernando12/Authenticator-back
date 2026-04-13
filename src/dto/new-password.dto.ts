import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  name: 'NewPassword',
  description: 'Data Transfer Object for setting a new password',
})
export class NewPasswordDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  code: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
