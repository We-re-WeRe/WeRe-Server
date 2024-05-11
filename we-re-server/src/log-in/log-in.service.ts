import { Injectable, Logger } from '@nestjs/common';
import { CreateLocalLoginInfoDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';
import { LogInRepository } from './log-in.repository';
import { LocalLoginInfoDto } from './dto/log-in.dto';
import { User } from 'src/entities/user.entity';
import { LoginInfo } from 'src/entities/login-info.entity';
import { CustomDataBaseException } from 'src/utils/custom_exceptions';

@Injectable()
export class LogInService {
  constructor(private readonly loginRepository: LogInRepository) {}
  /**
   * check account is already in DB.
   * @param account
   * @returns
   */
  async checkIsDuplicatedName(account: string): Promise<boolean> {
    const queryResult = await this.loginRepository.getIdByAccount(account);
    return !!queryResult;
  }

  /**
   * local login
   * @param localLoginInfoDto
   * @returns
   */
  async login(localLoginInfoDto: LocalLoginInfoDto): Promise<number | null> {
    const queryResult = await this.loginRepository.login(localLoginInfoDto);
    return queryResult?.id;
  }

  /**
   * create user info service. and return user id
   * @param createUserDto
   * @returns
   */
  async createUserAndLoginInfo(
    createLocalLoginInfoDto: CreateLocalLoginInfoDto,
  ): Promise<number> {
    const loginInfo = new LoginInfo();
    loginInfo.create(createLocalLoginInfoDto);
    const queryResult = await this.loginRepository.createUserAndLoginInfo(
      loginInfo,
    );
    Logger.log(JSON.stringify(queryResult));
    const userId = queryResult.user.id;
    if (!!!userId)
      throw new CustomDataBaseException('create user is not worked');
    return userId;
  }
}
