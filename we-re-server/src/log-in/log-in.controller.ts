import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LogInService } from './log-in.service';
import { CreateLocalLoginInfoDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';
import { LocalLoginInfoDto } from './dto/log-in.dto';
import { CustomNotFoundException } from 'src/utils/custom_exceptions';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('LogIn')
@Controller('log-in')
export class LogInController {
  constructor(private readonly logInService: LogInService) {}

  @Get('check/duplicated-account')
  async checkIsDuplicatedName(
    @Query('account') account: string,
  ): Promise<boolean> {
    return await this.logInService.checkIsDuplicatedName(account);
  }

  @Post()
  async login(@Body() localLoginInfoDto: LocalLoginInfoDto) {
    try {
      const result = await this.logInService.login(localLoginInfoDto);
      if (!result) {
        throw new CustomNotFoundException('log-in information');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('sign-on')
  async signOn(@Body() createLocalLoginInfoDto: CreateLocalLoginInfoDto) {
    try {
      const result = await this.logInService.createUserAndLoginInfo(
        createLocalLoginInfoDto,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
