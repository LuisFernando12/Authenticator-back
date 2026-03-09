import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserEntityType } from 'src/entity/user.entity';
import type { Repository } from 'typeorm';
import { UserDTO, UserResponseDTO } from '../dto/user.dto';
export interface IUserRepository {
  create(
    data: UserEntityType,
  ): Promise<Omit<UserResponseDTO, 'userClientConsent' | 'password'>>;
  findByEmail(email: string): Promise<UserResponseDTO & { password: string }>;
  existsUser(email: string): Promise<boolean>;
  activeAccount(email: string): Promise<boolean>;
  updatePassword(email: string, password: string): Promise<boolean>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async activeAccount(email: string): Promise<boolean> {
    const userDB = await this.userRepository.update(
      { email: email },
      { isVerified: true },
    );
    if (userDB.affected === 0) {
      return false;
    }
    return true;
  }
  async existsUser(email: string): Promise<boolean> {
    return await this.userRepository.existsBy({ email });
  }

  async create(
    data: UserDTO,
  ): Promise<Omit<UserResponseDTO, 'userClientConsent' | 'password'>> {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }
  async findByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }
  async updatePassword(email: string, password: string) {
    const userDB = await this.userRepository.update(
      { email: email },
      { password },
    );
    if (userDB.affected === 0) {
      return false;
    }
    return true;
  }
}
