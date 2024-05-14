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
import {
  CustomDataAlreadyExistException,
  CustomNotFoundException,
} from 'src/utils/custom_exceptions';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Get('check/duplicated-account')
  async checkIsDuplicatedAccount(
    @Query('account') account: string,
  ): Promise<boolean> {
    return await this.authService.checkIsDuplicatedAccount(account);
  }

  @Post('local/log-in')
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
      if (this.authService.checkIsDuplicatedAccount(createLocalAuthDto.account))
        throw new CustomDataAlreadyExistException(
          'this Account is already in.',
        );
      if (
        this.userService.checkNicknameIsUsed(createLocalAuthDto.user.nickname)
      )
        throw new CustomDataAlreadyExistException(
          'this Nickname is already in.',
        );
      const result = await this.authService.createUserAndLoginInfo(
        createLocalAuthDto,
      );
      return result;
    } catch (error) {
      throw error;
    }
  }
}
