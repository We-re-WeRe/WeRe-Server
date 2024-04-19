import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './users.repository';
import {
  ReadUserBriefDto,
  ReadUserDetailDto,
  ReadUserDto,
} from './dto/read-user.dto';
import { FollowDto } from './dto/follow.dto';
import { CustomNotFoundException } from 'src/utils/custom_exceptions';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneDetailById(id: number): Promise<ReadUserDetailDto> {
    try {
      const queryResult = await this.userRepository.findOneDetailById(id);
      Logger.log(JSON.stringify(queryResult));
      if (!queryResult) throw new CustomNotFoundException('id');
      const result: ReadUserDetailDto = new ReadUserDetailDto(queryResult);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findOneProfileImageById(id: number): Promise<ReadUserDto> {
    const queryResult = await this.userRepository.findOneProfileImageById(id);
    if (!queryResult) throw new CustomNotFoundException('id');
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
    if (!queryResult) throw new CustomNotFoundException('id');
    const result: ReadUserBriefDto = new ReadUserBriefDto(queryResult);
    return result;
  }

  /**
   * Create new follow join.
   * @param followDto follower's id and target id
   * @returns {void}
   */
  async createFollowRelation(followDto: FollowDto): Promise<void> {
    return await this.userRepository.createFollowRelation(followDto);
  }

  /**
   * update user's nickname, image or introduce.
   * @param updateUserDto update contents
   * @returns {Promise<void>} updated user detail info
   */
  async updateUserInfo(updateUserDto: UpdateUserDto): Promise<void> {
    const queryResult = await this.userRepository.update(
      updateUserDto.id,
      updateUserDto,
    );
    if (!queryResult.affected) {
      throw new CustomNotFoundException('id');
    }
  }

  /**
   * Delete user.
   * @param id
   * @returns {void}
   */
  async delete(id: number): Promise<void> {
    const queryResult = await this.userRepository.delete(id);
    if (!queryResult) {
      // storage is not deleted. error handling plz.
      throw new Error();
    }
    return;
  }

  /**
   * Delete follow join.
   * @param followDto follower's id and target id
   * @returns {void}
   */
  async deleteFollowRelation(followDto: FollowDto): Promise<void> {
    const queryResult = await this.userRepository.deleteFollowRelation(
      followDto,
    );
    return;
  }
}
