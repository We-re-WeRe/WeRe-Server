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
  CustomDataAlreadyExistException,
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
    return await this.usersService.findOneProfileImageById(id);
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
    @Query('ownerId') ownerId: number,
  ): Promise<ReadUserDetailDto> {
    if (!ownerId)
      if (userId) ownerId = userId;
      else throw new CustomBadTypeRequestException('ownerId', ownerId);
    return await this.usersService.findOneDetailById(userId, ownerId);
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
    const result = this.usersService.checkNicknameIsUsed(nickname);
    return result;
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
    if (userId === targetId) throw new BadRequestException("can't follow self");
    const followDto = new FollowDto(userId, targetId);
    if (await this.usersService.checkUserIsFollowing(followDto))
      throw new CustomDataAlreadyExistException();
    await this.usersService.createFollowRelation(followDto);
    const result = await this.usersService.findOneDetailById(userId, targetId);
    if (!result) throw new CustomNotFoundException('targetId');
    return result;
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
    if (userId === targetId)
      throw new BadRequestException("can't unfollow self");
    const followDto = new FollowDto(userId, targetId);
    await this.usersService.deleteFollowRelation(followDto);
    const result = await this.usersService.findOneDetailById(userId, targetId);
    return result;
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
    await this.usersService.updateUserInfo(userId, updateUserDto);
    return await this.usersService.findOneDetailById(userId, userId);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiNoContentResponse({
    description: 'Request Success',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(@UserId() userId: number): Promise<void> {
    return await this.usersService.delete(userId);
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
    const result = await this.usersService.createUserInfo(createUserDto);
    return result;
  }
}
