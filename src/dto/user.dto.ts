import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({
  name: 'User',
  description: 'Data Transfer Object for user',
})
export class UserDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class UserResponseDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  isVerified: boolean;
  @IsString({ each: true })
  @IsNotEmpty()
  @ApiProperty()
  userClientConsent: Array<{
    scope: Array<string>;
    clients: Array<{ clientId: string }>;
  }>;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  createdAt: Date;
}
