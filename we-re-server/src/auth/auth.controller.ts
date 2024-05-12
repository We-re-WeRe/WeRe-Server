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
import { AuthService } from './auth.service';
import { CreateLocalAuthDto } from './dto/create-auth.dto';
import { UpdateLogInDto } from './dto/update-auth.dto';
import { LocalAuthDto } from './dto/auth.dto';
import { CustomNotFoundException } from 'src/utils/custom_exceptions';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('check/duplicated-account')
  async checkIsDuplicatedName(
    @Query('account') account: string,
  ): Promise<boolean> {
    return await this.authService.checkIsDuplicatedName(account);
  }

  @Post('local/login')
  async localLogin(@Body() localAuthDto: LocalAuthDto) {
    try {
      const result = await this.authService.localLogin(localAuthDto);
      if (!result) {
        throw new CustomNotFoundException('log-in information');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  @Post('sign-on')
  async signOn(@Body() createLocalAuthDto: CreateLocalAuthDto) {
    try {
      const result = await this.authService.createUserAndLoginInfo(
        createLocalAuthDto,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
