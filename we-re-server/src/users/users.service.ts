import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneWithDetailById(id: number) {
    return await this.userRepository.findOneWithDetailById(id);
  }

  async findOneProfileImageById(id: number) {
    return await this.userRepository.findOneProfileImageById(id);
  }
  /**
   * get user brief info
   * @param id user id
   * @returns {User} user.id, user.imageURL, user.nickname, user.follower_count
   */
  async findOneBriefById(id: number) {
    return await this.userRepository.findOneBriefById(id);
  }
}
