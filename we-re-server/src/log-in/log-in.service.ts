import { Injectable } from '@nestjs/common';
import { CreateLocalLoginInfoDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';
import { LogInRepository } from './log-in.repository';
import { LocalLoginInfoDto } from './dto/log-in.dto';

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
}
