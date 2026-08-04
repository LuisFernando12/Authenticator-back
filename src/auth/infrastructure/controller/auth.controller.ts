import { NewPasswordDTO } from '@/auth/infrastructure/dto/new-password.dto';
import { NewTokenToActiveEmailDTO } from '@/auth/infrastructure/dto/new-token.dto';
import { ResetPasswordDTO } from '@/auth/infrastructure/dto/reset-password.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IContextClient } from '../../../config/decorator/context-client.decorator';
import { ActiveAccountUseCase } from '../../application/use-case/active-account.use-case';
import {
  ILoginUseCaseResponse,
  LoginUseCase,
} from '../../application/use-case/login.use-case';
import { NewPasswordUseCase } from '../../application/use-case/new-password.use-case';
import { ResetPasswordUseCase } from '../../application/use-case/reset-password.use-case';
import { LoginDTO } from '../dto/login.dto';
import { SendNewTokenToEmailActiveUseCase } from './../../application/use-case/send-new-token-to-email-active.use-case';

export interface IAuthController {
  login(
    data: LoginDTO,
    contextClient: IContextClient,
  ): Promise<ILoginUseCaseResponse>;
  verifyEmail(token: string): Promise<void>;
  resetPassword(data: { email: string }): Promise<{ message: string }>;
  newPassword(data: NewPasswordDTO): Promise<void>;
  sendNewTokenToEmailActive({
    email,
  }: NewTokenToActiveEmailDTO): Promise<{ message: string }>;
}

@Controller()
@Throttle({ default: { limit: 5, ttl: 60000 } })
export class AuthController implements IAuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly activeAccountUseCase: ActiveAccountUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly newPasswordUseCase: NewPasswordUseCase,
    private readonly sendNewTokenToEmailActiveUseCase: SendNewTokenToEmailActiveUseCase,
  ) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDTO })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async login(
    @Body() data: LoginDTO,
    @IContextClient() contextClient: IContextClient,
  ) {
    return await this.loginUseCase.execute({
      email: data.email,
      password: data.password,
      ip: contextClient.ip,
      userAgent: contextClient.useAgent,
    });
  }
  @Get('/verify-email')
  @ApiQuery({ name: 'token', type: String })
  @ApiResponse({ status: 200, description: 'Email verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async verifyEmail(@Query('token') token: string) {
    await this.activeAccountUseCase.execute(token);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: ResetPasswordDTO })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 400, description: 'Email not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async resetPassword(
    @Body() data: ResetPasswordDTO,
  ): Promise<{ message: string }> {
    return await this.resetPasswordUseCase.execute(data.email);
  }
  @Post('/new-password')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: NewPasswordDTO })
  @ApiResponse({ status: 200, description: 'Password updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid code or email' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async newPassword(@Body() data: NewPasswordDTO) {
    await this.newPasswordUseCase.execute(data);
  }
  @Post('/new-token/email-active')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: NewTokenToActiveEmailDTO })
  @ApiResponse({ status: 200, description: 'Email sent successfully.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid email or account already active',
  })
  async sendNewTokenToEmailActive(
    @Body() { email }: NewTokenToActiveEmailDTO,
  ): Promise<{ message: string }> {
    return await this.sendNewTokenToEmailActiveUseCase.execute(email);
  }
}
