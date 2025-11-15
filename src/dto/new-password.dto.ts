import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  name: 'NewPassword',
  description: 'Data Transfer Object for setting a new password',
})
export class NewPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  code: number;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
