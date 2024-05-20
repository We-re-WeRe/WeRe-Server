import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDetailDto, ReadUserDto } from './dto/read-user.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FollowDto } from './dto/follow.dto';
import {
  CustomBadTypeRequestException,
  CustomNotFoundException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import { Public, UserId } from 'src/utils/custom_decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "get User's profile image" })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDto,
  })
  @Get('my-profile-image')
  async findMyProfileImageById(@UserId() id: number): Promise<ReadUserDto> {
    try {
      return await this.usersService.findOneProfileImageById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary:
      'get User detail. if user called own id, it will return isMine true',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Public()
  @Get('detail')
  async findOneDetailById(
    @UserId() userId: number,
    @Query('targetId') targetId: number,
  ): Promise<ReadUserDetailDto> {
    try {
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      else return await this.usersService.findOneDetailById(userId, targetId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'get my detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Get('my-page')
  async findMyDetailById(@UserId() userId: number): Promise<ReadUserDetailDto> {
    try {
      return await this.usersService.findOneDetailById(userId, userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'check this nickname is used.' })
  @ApiOkResponse({
    description: 'Request Success',
    type: Boolean,
  })
  @Get('check')
  async checkNicknameIsUsed(
    @Query('nickname') nickname: string,
  ): Promise<boolean> {
    try {
      const result = this.usersService.checkNicknameIsUsed(nickname);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User followed target id' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Patch('follow')
  async createFollowRelation(
    @UserId() userId: number,
    @Query('targetId') targetId: number,
  ): Promise<ReadUserDetailDto> {
    // 중복 키 에러 체크 필요.
    try {
      if (userId === targetId)
        throw new BadRequestException("can't follow self");
      const followDto = new FollowDto(userId, targetId);
      await this.usersService.createFollowRelation(followDto);
      const result = await this.usersService.findOneDetailById(
        userId,
        targetId,
      );
      if (!result) throw new CustomNotFoundException('targetId');
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User unfollowed target id' })
  @ApiNoContentResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Patch('unfollow')
  async deleteFollowRelation(
    @UserId() userId: number,
    @Query('targetId') targetId: number,
  ): Promise<ReadUserDetailDto> {
    try {
      if (userId === targetId)
        throw new BadRequestException("can't unfollow self");
      const followDto = new FollowDto(userId, targetId);
      await this.usersService.deleteFollowRelation(followDto);
      const result = await this.usersService.findOneDetailById(
        userId,
        targetId,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'update User information and Return User detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Patch()
  async updateUserInfo(
    @UserId() userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDetailDto> {
    try {
      if (userId !== updateUserDto.id)
        throw new CustomUnauthorziedException(`you can't update`);
      await this.usersService.updateUserInfo(updateUserDto);
      return await this.usersService.findOneDetailById(
        userId,
        updateUserDto.id,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({
    description: 'Request Success',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@UserId() userId: number): Promise<void> {
    try {
      return await this.usersService.delete(userId);
    } catch (error) {
      throw error;
    }
  }

  // Deprecated
  @ApiOperation({
    summary: ':Deprecated: create User information and Return User id',
  })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: Number,
  })
  @Post()
  async createUserInfo(@Body() createUserDto: CreateUserDto): Promise<number> {
    try {
      const result = await this.usersService.createUserInfo(createUserDto);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
