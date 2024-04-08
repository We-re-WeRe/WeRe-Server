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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadUserDetailDto, ReadUserDto } from './dto/read-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

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
    Logger.log(id);
    return await this.usersService.findOneProfileImageById(+id);
  }

  // @Get('info')
  // findOneWithPoint(@Query('id') id: string, @Req() req: Request) {
  //   Logger.log(req);
  //   return this.usersService.findOne(+id);
  // }

  @ApiOperation({ summary: 'get User detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Get('detail/:id')
  async findOneDetailById(@Param('id') id: string): Promise<ReadUserDetailDto> {
    Logger.log(id);
    return await this.usersService.findOneDetailById(+id);
  }

  @ApiOperation({ summary: 'update User information and Return User detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadUserDetailDto,
  })
  @Patch('/:id')
  async updateUserInfo(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDetailDto> {
    // param id와 dto 내 id 체크로 자격 여부 판단하는거도 ㄱㅊ할듯
    return await this.usersService.updateUserInfo(updateUserDto);
  }
}
