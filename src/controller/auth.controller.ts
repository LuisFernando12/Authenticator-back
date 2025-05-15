import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { NewPasswordDTO } from 'src/dto/new-password.dto';
import { ReasetPasswordDTO } from 'src/dto/reset-password.dto';
import { AuthService } from 'src/service/auth.service';

export interface IAuthController {
  login(data: LoginDTO): Promise<any>;
  verifyEmail(email: string): void;
  resetPassword(data: { email: string }): Promise<{ message: string }>;
  newPassword(data: NewPasswordDTO): void;
  oauth(): void;
  callback(): void;
}

@Controller()
export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() data: LoginDTO) {
    return await this.authService.login(data.email, data.password);
  }
  @Get('/verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }
  @Post('/reset-password')
  async resetPassword(
    @Body() data: ReasetPasswordDTO,
  ): Promise<{ message: string }> {
    return await this.authService.resetPassword(data.email);
  }
  @Post('/new-password')
  async newPassword(@Body() data: NewPasswordDTO) {
    return await this.authService.newPassword(
      data.password,
      data.code,
      data.email,
    );
  }
  @Get('/oauth')
  async oauth() {
    throw new Error('Method not implemented');
  }
  @Get('/callback')
  async callback() {
    throw new Error('Method not implemented');
  }
}
