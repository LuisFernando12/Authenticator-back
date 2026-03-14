import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { LoginDTO } from '../dto/login.dto';
import { OauthAuthorizeDTO, OauthTokenDTO } from '../dto/oauth-authorize.dto';
import { OauthService } from '../service/oauth.service';
export interface IOauthController {
  authorize(payloadOauthAuthorize: OauthAuthorizeDTO): Promise<{
    url: string;
    statusCode: number;
  }>;
  token(payloadOauthToken: OauthTokenDTO): Promise<any>;
  login(
    payloadOauthLogin: LoginDTO,
    QueryOauthLogin: OauthAuthorizeDTO,
  ): Promise<{
    url: string;
    statusCode: number;
  }>;
}
@Controller('oauth')
export class OauthController implements IOauthController {
  constructor(private readonly oauthService: OauthService) {}
  @Get('/authorize')
  @Redirect()
  @HttpCode(HttpStatus.FOUND)
  @ApiQuery({ type: OauthAuthorizeDTO })
  @ApiResponse({ status: HttpStatus.FOUND, description: 'Found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async authorize(
    @Query() payloadOauthAuthorize: OauthAuthorizeDTO,
  ): Promise<any> {
    const urlRedirect = await this.oauthService.authorize(
      payloadOauthAuthorize,
    );
    return { url: urlRedirect.toString(), statusCode: 302 };
  }
  @Post('/token')
  @ApiBody({ type: OauthTokenDTO })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Created and returned token',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async token(@Body() payloadOauthCallback: OauthTokenDTO): Promise<any> {
    return await this.oauthService.token(payloadOauthCallback);
  }
  @Post('/login')
  @Redirect()
  @HttpCode(HttpStatus.FOUND)
  @ApiBody({ type: LoginDTO })
  @ApiQuery({ type: OauthAuthorizeDTO })
  @ApiResponse({ status: HttpStatus.FOUND, description: 'Found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async login(
    @Body() payloadOauthLogin: LoginDTO,
    @Query() QueryOauthLogin: OauthAuthorizeDTO,
  ): Promise<any> {
    const urlRedirect = await this.oauthService.login(
      payloadOauthLogin,
      QueryOauthLogin,
    );
    return { url: urlRedirect.toString(), statusCode: 302 };
  }
}
