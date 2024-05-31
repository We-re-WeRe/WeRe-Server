import { Controller, Get, Post, Body, Patch, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLocalAuthDto } from './dto/create-auth.dto';
import { LocalAuthDto } from './dto/auth.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { ReadJWTDto } from './dto/jwt.dto';
import { Response } from 'express';
import { Public, RefreshRequired, UserId } from 'src/utils/custom_decorators';

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
  @Public()
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
  @Public()
  @Post('login/local')
  async localLogin(
    @Body() localAuthDto: LocalAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.localLogin(localAuthDto);
      this.setTokenInResponseAndHeader(res, result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'log out. authorization in header should be Refresh Token',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadJWTDto,
  })
  @RefreshRequired()
  @Patch('logout')
  async logout(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.logout(userId);
      this.removeTokenInCookie(res);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'refresh token. authorization in header should be Refresh Token',
  })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadJWTDto,
  })
  @RefreshRequired()
  @Post('refresh')
  async refreshJwt(
    @UserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const result = await this.authService.getJWTDto(userId);
      this.setTokenInResponseAndHeader(res, result);
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
  @Public()
  @Post('signon')
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
      this.setTokenInResponseAndHeader(res, result);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * set tokens in response and header.
   * @param res
   * @param jwtDto
   */
  setTokenInResponseAndHeader(res: Response, jwtDto: ReadJWTDto): void {
    this.addTokenInHeader(res, jwtDto);
    this.addTokenInCookie(res, jwtDto);
  }

  /**
   * set header
   * @param res Response
   * @param jwtDto
   */
  addTokenInHeader(res: Response, jwtDto: ReadJWTDto): void {
    const { accessToken, refreshToken } = jwtDto;
    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
  }

  /**
   * add token in cookie at response
   * @param res
   * @param jwtDto
   */
  addTokenInCookie(res: Response, jwtDto: ReadJWTDto): void {
    const { accessToken, refreshToken } = jwtDto;
    const oneSecondToMilli = 1000;
    const oneDayToSecond = 24 * 60 * 60;

    const accessTokenAge = 30 * oneSecondToMilli;
    const refreshTokenAge = 7 * oneDayToSecond * oneSecondToMilli;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: accessTokenAge,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenAge,
    });
  }

  /**
   * remove token in cookie at response
   * @param res
   */
  removeTokenInCookie(res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
}
