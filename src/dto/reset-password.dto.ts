import { IsEmail, IsNotEmpty } from 'class-validator';

export class ReasetPasswordDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
