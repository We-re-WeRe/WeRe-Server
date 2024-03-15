import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneWithDetailById(id: number) {
    return await this.userRepository.findOneWithDetailById(id);
  }

  async findOneProfileImageById(id: number) {
    return await this.userRepository.findOneProfileImageById(id);
  }
}
