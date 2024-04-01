import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';
import {
  ReadUserBreifDto,
  ReadUserDetailDto,
  ReadUserProfileImageDto,
} from './dto/read-user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneDetailById(id: number): Promise<ReadUserDetailDto> {
    const queryResult = await this.userRepository.findOneDetailById(id);
    const result: ReadUserDetailDto = new ReadUserDetailDto();
    result.entityToDto(queryResult);
    return result;
  }

  async findOneProfileImageById(id: number): Promise<ReadUserProfileImageDto> {
    const queryResult = await this.userRepository.findOneProfileImageById(id);
    const result: ReadUserProfileImageDto = plainToInstance(
      ReadUserProfileImageDto,
      queryResult,
    );
    return result;
  }
  /**
   * get user brief info
   * @param id user id
   * @returns {User} user.id, user.imageURL, user.nickname, user.follower_count
   */
  async findOneBriefById(id: number): Promise<ReadUserDetailDto> {
    const queryResult = await this.userRepository.findOneBriefById(id);
    const result: ReadUserBreifDto = new ReadUserBreifDto();
    result.entityToDto(queryResult);
    return result;
  }
}
