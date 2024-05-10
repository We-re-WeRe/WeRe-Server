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
import { CreateLoginInfoDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';

@Controller('log-in')
export class LogInController {
  constructor(private readonly logInService: LogInService) {}

  @Get('check/duplicated-account')
  checkIsDuplicatedName(@Query('account') account: string) {
    return this.logInService.checkIsDuplicatedName(account);
  }
}
