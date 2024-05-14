import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLocalAuthDto } from './dto/create-auth.dto';
import { UpdateLogInDto } from './dto/update-auth.dto';
import { LocalAuthDto } from './dto/auth.dto';
import {
  CustomDataAlreadyExistException,
  CustomNotFoundException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { ReadJWTDto } from './dto/jwt.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'check account is duplicated' })
  @ApiOkResponse({
    description: 'Request Success',
    type: Boolean,
  })
  @Get('check/duplicated-account')
  async checkIsDuplicatedAccount(
    @Query('account') account: string,
  ): Promise<boolean> {
    return await this.authService.checkIsDuplicatedAccount(account);
  }

  @ApiOperation({ summary: 'login' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadJWTDto,
  })
  @Post('local/log-in')
  async localLogin(@Body() localAuthDto: LocalAuthDto) {
    try {
      const result = await this.authService.localLogin(localAuthDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'sign on' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadJWTDto,
  })
  @Post('sign-on')
  async signOn(@Body() createLocalAuthDto: CreateLocalAuthDto) {
    try {
      await this.authService.checkIsDuplicatedAccount(
        createLocalAuthDto.account,
      );

      await this.userService.checkNicknameIsUsed(
        createLocalAuthDto.user.nickname,
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
