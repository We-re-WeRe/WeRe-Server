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
import {
  CustomDataAlreadyExistException,
  CustomDataBaseException,
  CustomNotFoundException,
} from 'src/utils/custom_exceptions';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findOneDetailById(
    userId: number,
    targetId: number,
  ): Promise<ReadUserDetailDto> {
    const queryResult = await this.userRepository.findOneDetailById(targetId);
    if (!queryResult) throw new CustomNotFoundException('targetId');
    const result: ReadUserDetailDto = new ReadUserDetailDto(
      userId,
      queryResult,
    );
    const followDto = new FollowDto(userId, targetId);
    result.setIsFollowing(await this.checkUserIsFollowing(followDto));
    return result;
  }

  async checkUserIsFollowing(followDto: FollowDto): Promise<boolean> {
    const result = await this.userRepository.findOneByIdAndtargetId(followDto);
    return result;
  }

  async findOneProfileImageById(id: number): Promise<ReadUserDto> {
    const queryResult = await this.userRepository.findOneProfileImageById(id);
    if (!queryResult) throw new CustomNotFoundException('id');
    Logger.log(JSON.stringify(queryResult));
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
    if (!queryResult) throw new CustomNotFoundException('userId');
    const result: ReadUserBriefDto = new ReadUserBriefDto(queryResult);
    return result;
  }

  /**
   * checking service nickname is duplicated.
   * @param nickname
   * @returns
   */
  async checkNicknameIsUsed(nickname: string): Promise<boolean> {
    const queryResult = await this.userRepository.getIdByNickname(nickname);
    return !!queryResult;
  }
  /**
   * create user info service.
   * @param createUserDto
   * @returns
   */
  async createUserInfo(createUserDto: CreateUserDto): Promise<number> {
    const queryResult = await this.userRepository.createUserInfo(createUserDto);
    const id = queryResult.identifiers[0].id;
    if (!!!id) throw new CustomDataBaseException('create user is not worked');
    return id;
  }

  /**
   * Create new follow join.
   * @param followDto follower's id and target id
   * @returns {void}
   */
  async createFollowRelation(followDto: FollowDto): Promise<void> {
    const queryResult = await this.userRepository.findOneBy({
      id: followDto.targetId,
    });
    if (!queryResult) throw new CustomNotFoundException('targetId');
    return await this.userRepository.createFollowRelation(followDto);
  }

  /**
   * update user's nickname, image or introduce.
   * @param updateUserDto update contents
   * @returns {Promise<void>} updated user detail info
   */
  async updateUserInfo(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    const queryResult = await this.userRepository.update(userId, updateUserDto);
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
    const queryResult = await this.userRepository.findOneBy({
      id: followDto.targetId,
    });
    if (!queryResult) throw new CustomNotFoundException('targetId');
    await this.userRepository.deleteFollowRelation(followDto);
    return;
  }
}
