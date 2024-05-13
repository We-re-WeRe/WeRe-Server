import { Injectable, Logger } from '@nestjs/common';
import { CreateLocalAuthDto } from './dto/create-auth.dto';
import { AuthRepository } from './auth.repository';
import { LocalAuthDto } from './dto/auth.dto';
import { Auth } from 'src/entities/auth.entity';
import {
  CustomDataBaseException,
  CustomNotFoundException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import { JwtService } from '@nestjs/jwt';
import { ReadJWTDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * check account is already in DB.
   * @param account
   * @returns
   */
  async checkIsDuplicatedName(account: string): Promise<boolean> {
    const queryResult = await this.authRepository.getIdByAccount(account);
    return !!queryResult;
  }

  /**
   * local login
   * @param localAuthDto
   * @returns
   */
  async localLogin(localAuthDto: LocalAuthDto): Promise<ReadJWTDto> {
    const { account, password } = localAuthDto;
    const queryResult = await this.authRepository.localLogin(account);
    if (!!!queryResult) {
      throw new CustomNotFoundException('account');
    }
    if (queryResult?.password !== password) {
      throw new CustomUnauthorziedException('Password is wrong.');
    }
    const userId = queryResult.user.id;
    const result = this.issueJWTToken(userId);
    return result;
  }

  /**
   * create user info service. and return user id
   * @param createUserDto
   * @returns
   */
  async createUserAndLoginInfo(
    createLocalLoginInfoDto: CreateLocalAuthDto,
  ): Promise<ReadJWTDto> {
    const auth = new Auth();
    auth.create(createLocalLoginInfoDto);
    const queryResult = await this.authRepository.createUserAndAuth(auth);
    const userId = queryResult.user.id;
    if (!!!userId)
      throw new CustomDataBaseException('create user is not worked');
    const result = this.issueJWTToken(userId);
    return result;
  }

  /**
   * Issue JWT token to authorize. Refresh token is always issued when access token is issued.
   * @param userId
   * @returns read jwt dto
   */
  async issueJWTToken(userId: number): Promise<ReadJWTDto> {
    const payload = { userId };
    const accessToken = await this.jwtService.signAsync(payload);
    const result = new ReadJWTDto(accessToken, '');
    return result;
  }
}
