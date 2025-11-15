import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserDTO } from 'src/dto/user.dto';
import { UserService } from 'src/service/user.service';

export interface IUserController {
  register: (user: UserDTO) => Promise<{ message: string }>;
}

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  @ApiBody({ type: UserDTO })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async register(@Body() user: UserDTO) {
    await this.userService.register(user);
    return {
      message: 'User created. Please verify your email to account active',
    };
  }
}
