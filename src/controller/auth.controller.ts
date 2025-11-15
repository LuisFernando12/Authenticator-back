import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { LoginDTO } from 'src/dto/login.dto';
import { NewPasswordDTO } from 'src/dto/new-password.dto';
import { ReasetPasswordDTO } from 'src/dto/reset-password.dto';
import { AuthService } from 'src/service/auth.service';

export interface IAuthController {
  login(data: LoginDTO): Promise<any>;
  verifyEmail(token: string, res: Response): void;
  resetPassword(data: { email: string }): Promise<{ message: string }>;
  newPassword(data: NewPasswordDTO): void;
  oauth(): void;
  callback(): void;
}

@Controller()
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data.email, data.password);
  }
  @Get('/verify-email')
  @ApiQuery({ name: 'token', type: String })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
  @Post('/reset-password')
  @ApiBody({ type: ReasetPasswordDTO })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async resetPassword(
    @Body() data: ReasetPasswordDTO,
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(data.email);
  }
  @Post('/new-password')
  @ApiBody({ type: NewPasswordDTO })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid code or email' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async newPassword(@Body() data: NewPasswordDTO) {
    return await this.authService.newPassword(
      data.password,
      data.code,
      data.email,
    );
  }
  @Get('/oauth')
  async oauth() {
    throw new MethodNotAllowedException('Method not implemented');
  }
  @Get('/callback')
  async callback() {
    throw new MethodNotAllowedException('Method not implemented');
  }
}
