import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNumber()
  @IsNotEmpty()
  code: number;
  @IsString()
  @IsNotEmpty()
  password: string;
}
