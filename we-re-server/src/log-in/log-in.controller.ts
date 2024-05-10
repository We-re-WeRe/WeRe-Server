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
    return;
  }
}
