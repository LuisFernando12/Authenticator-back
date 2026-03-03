import { IsOptional, IsString } from 'class-validator';

export class OauthAuthorizeDTO {
  @IsString()
  responseType: string;
  @IsString()
  clientId: string;
  @IsString()
  redirectUri: string;
  @IsString()
  state: string;
  @IsString()
  @IsOptional()
  scope?: string;
  @IsString()
  // @IsBase64()
  @IsOptional()
  codeChallenge?: string;
  @IsString()
  @IsOptional()
  codeChallengeMethod?: string;
}
export class OauthTokenDTO {
  @IsString()
  grantType: string;
  @IsString()
  clientId: string;
  @IsOptional()
  @IsString()
  clientSecret?: string;
  @IsString()
  redirectUri: string;
  @IsString()
  code: string;
  @IsString()
  codeVerifier: string;
}
