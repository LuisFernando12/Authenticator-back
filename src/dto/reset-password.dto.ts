import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

@ApiSchema({
  name: 'ResetPassword',
  description: 'Data Transfer Object for resetting password',
})
export class ResetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
