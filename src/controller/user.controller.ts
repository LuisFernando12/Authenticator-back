import { UserService } from 'src/service/user.service';
import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';

export interface IUserController {
  register: (user: UserDTO) => Promise<{ message: string }>;
  //   verifyEmail: () => void;
  //   newPassword: () => void;
  //   oauth: () => void;
  //   callback: () => void;
}

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  async register(@Body() user: UserDTO) {
    try {
      await this.userService.register(user);
      return {
        message: 'User created. Please verify your email to account active',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
