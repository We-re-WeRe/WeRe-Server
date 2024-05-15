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
  Res,
  Headers,
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
import { Response } from 'express';

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
  @Post('log-in/local')
  async localLogin(
    @Body() localAuthDto: LocalAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.localLogin(localAuthDto);
      this.setHeaderAndCookieInResponse(res, result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'refresh token' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadJWTDto,
  })
  @Post('refresh')
  async refreshJwt(
    @Headers() headers,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = this.extractTokenFromHeader(headers);
    if (!token) {
      throw new CustomUnauthorziedException('log in again');
    }
    try {
      const { userId } = await this.authService.validateRefreshToken(token);
      const result = await this.authService.getJWTDto(userId);
      this.setHeaderAndCookieInResponse(res, result);
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
  async signOn(
    @Body() createLocalAuthDto: CreateLocalAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
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
      this.setHeaderAndCookieInResponse(res, result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * set header and cookie for browser.
   * @param res Response
   * @param jwtDto
   */
  setHeaderAndCookieInResponse(res: Response, jwtDto: ReadJWTDto): void {
    const { accessToken, refreshToken } = jwtDto;
    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
  }
  /**
   * extract token from header
   * @param request
   * @returns
   */
  private extractTokenFromHeader(headers: any): string | undefined {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
