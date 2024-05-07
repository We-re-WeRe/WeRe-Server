import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Logger,
  Query,
  HttpStatus,
  HttpCode,
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

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "get User's profile image" })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDto,
  })
  @Get('profile-image/:id')
  async findOneProfileImageById(@Param('id') id: string): Promise<ReadUserDto> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return await this.usersService.findOneProfileImageById(+id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'get User detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Get('detail/:id')
  async findOneDetailById(@Param('id') id: number): Promise<ReadUserDetailDto> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return await this.usersService.findOneDetailById(id);
    } catch (error) {
      throw error;
    }
  }

  @Get('check/nickname/:nickname')
  async checkNicknameIsUsed(
    @Param('nickname') nickname: string,
  ): Promise<boolean> {
    try {
      const result = this.usersService.checkNicknameIsUsed(nickname);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'create User information and Return User id' })
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

  @ApiOperation({ summary: 'User followed target id' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Post('following')
  async createFollowRelation(
    @Body() followDto: FollowDto,
  ): Promise<ReadUserDetailDto> {
    // 중복 키 에러 체크 필요.
    try {
      await this.usersService.createFollowRelation(followDto);
      const result = await this.usersService.findOneDetailById(
        followDto.targetId,
      );
      if (!result) throw new CustomNotFoundException('targetId');
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
  @Patch('/:id')
  async updateUserInfo(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDetailDto> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      if (id !== updateUserDto.id)
        throw new CustomUnauthorziedException(`id is wrong.`);
      await this.usersService.updateUserInfo(updateUserDto);
      return await this.usersService.findOneDetailById(updateUserDto.id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User unfollowed target id' })
  @ApiNoContentResponse({
    description: 'Request Success',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return await this.usersService.delete(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User unfollowed target id' })
  @ApiNoContentResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Delete('/:id/following/:targetId')
  async deleteFollowRelation(
    @Param() followDto: FollowDto,
  ): Promise<ReadUserDetailDto> {
    try {
      await this.usersService.deleteFollowRelation(followDto);
      const result = await this.usersService.findOneDetailById(
        followDto.targetId,
      );
      if (!result) throw new CustomNotFoundException('targetId');
      return result;
    } catch (error) {
      throw error;
    }
  }
}
