import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OauthAuthorizeDTO {
  @IsString()
  @ApiProperty()
  oauthRequestId: string;
  @IsString()
  @ApiProperty()
  responseType: string;
  @IsString()
  @ApiProperty()
  clientId: string;
  @ApiProperty()
  @IsString()
  @ApiProperty()
  redirectUri: string;
  @IsString()
  @ApiProperty()
  state: string;
  @IsString()
  @ApiProperty()
  scope: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  codeChallenge?: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  codeChallengeMethod?: string;
}
export class OauthTokenDTO {
  @IsString()
  @ApiProperty()
  grantType: string;
  @IsString()
  @ApiProperty()
  clientId: string;
  @IsOptional()
  @IsString()
  @ApiProperty()
  clientSecret?: string;
  @IsString()
  @ApiProperty()
  redirectUri: string;
  @IsString()
  @ApiProperty()
  code: string;
  @IsString()
  @IsOptional()
  @ApiProperty()
  codeVerifier?: string;
}
