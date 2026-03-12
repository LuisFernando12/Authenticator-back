import { IsArray, IsString } from 'class-validator';

export class SaveClientDTO {
  @IsString()
  name: string;
  @IsArray()
  redirectUris: Array<string>;
  @IsArray()
  grantTypes: Array<string>;
  @IsArray()
  scopes: Array<string>;
}
