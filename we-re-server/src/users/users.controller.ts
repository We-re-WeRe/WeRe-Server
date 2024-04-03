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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  @Get('detail/:id')
  async findOneDetailById(@Param('id') id: string): Promise<ReadUserDetailDto> {
    Logger.log(id);
    return await this.usersService.findOneDetailById(+id);
  }
}
