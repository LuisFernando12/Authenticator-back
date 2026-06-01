import { UserDTO } from '@/user/infrastructure/dto/user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/use-case/register-user.use-case';

export interface IUserController {
  register: (user: UserDTO) => Promise<{ message: string }>;
}

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}
  @Post()
  @ApiBody({ type: UserDTO })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() user: UserDTO) {
    return await this.registerUserUseCase.execute(user);
  }
}
