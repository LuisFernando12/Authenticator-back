import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserEntityType } from 'src/entity/user.entity';
import type { Repository } from 'typeorm';
export interface IUserRepository {
  create(data: UserEntityType);
  findByEmail(email: string): Promise<UserEntity>;
  activeAccount(email: string);
  updatePassword(email: string, password: string);
}
@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async activeAccount(email: string) {
    return await this.userRepository.update(
      { email: email },
      { isVerified: true },
    );
  }
  async existsUser(email: string) {
    return await this.userRepository.existsBy({ email });
  }

  async create(data: UserEntityType) {
    return await this.userRepository.save(data);
  }
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  async updatePassword(email: string, password: string) {
    return await this.userRepository.update({ email: email }, { password });
  }
}
