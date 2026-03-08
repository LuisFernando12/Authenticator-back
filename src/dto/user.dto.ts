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
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clientId: string;
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
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  clients: Array<{ clientId: string }>;
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  createdAt: Date;
}
