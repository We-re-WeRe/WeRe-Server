import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import {
  ReadUserBriefDto,
  ReadUserDetailDto,
  ReadUserDto,
} from './dto/read-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneDetailById(id: number): Promise<ReadUserDetailDto> {
    const queryResult = await this.userRepository.findOneDetailById(id);
    const result: ReadUserDetailDto = new ReadUserDetailDto(queryResult);
    result.rawToDto(queryResult);
    return result;
  }

  async findOneProfileImageById(id: number): Promise<ReadUserDto> {
    const queryResult = await this.userRepository.findOneProfileImageById(id);
    const result: ReadUserDto = new ReadUserDto(queryResult);
    return result;
  }
  /**
   * get user brief info
   * @param id user id
   * @returns {ReadUserBriefDto}
   */
  async findOneBriefById(id: number): Promise<ReadUserBriefDto> {
    const queryResult = await this.userRepository.findOneBriefById(id);
    const result: ReadUserBriefDto = new ReadUserBriefDto(queryResult);
    return result;
  }

  /**
   * update user's nickname, image or introduce.
   * @param updateUserDto update contents
   * @returns {ReadUserDetailDto} updated user detail info
   */
  async updateUserInfo(
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDetailDto> {
    await this.userRepository.update(updateUserDto.id, updateUserDto);
    const result = this.userRepository.findOneDetailById(updateUserDto.id);
    return result;
  }
}
