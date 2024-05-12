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
    const payload = { userId: queryResult.id };
    const accessToken = await this.jwtService.signAsync(payload);
    const result = new ReadJWTDto(accessToken, '');
    return result;
  }

  /**
   * create user info service. and return user id
   * @param createUserDto
   * @returns
   */
  async createUserAndLoginInfo(
    createLocalLoginInfoDto: CreateLocalAuthDto,
  ): Promise<number> {
    const auth = new Auth();
    auth.create(createLocalLoginInfoDto);
    const queryResult = await this.authRepository.createUserAndAuth(auth);
    Logger.log(JSON.stringify(queryResult));
    const userId = queryResult.user.id;
    if (!!!userId)
      throw new CustomDataBaseException('create user is not worked');
    return userId;
  }
}
