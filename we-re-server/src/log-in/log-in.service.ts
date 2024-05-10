import { Injectable } from '@nestjs/common';
import { CreateLoginInfoDto } from './dto/create-log-in.dto';
import { UpdateLogInDto } from './dto/update-log-in.dto';
import { LogInRepository } from './log-in.repository';

@Injectable()
export class LogInService {
  constructor(private readonly loginRepository: LogInRepository) {}
  async checkIsDuplicatedName(account: string): Promise<boolean> {
    const queryResult = await this.loginRepository.getIdByAccount(account);
    return !!queryResult;
  }
}
