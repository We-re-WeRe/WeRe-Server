import { Injectable } from '@nestjs/common';
import { LoginInfo } from 'src/entities/login-info.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateLoginInfoDto } from './dto/create-log-in.dto';

@Injectable()
export class LogInRepository extends Repository<LoginInfo> {
  constructor(private dataSource: DataSource) {
    super(LoginInfo, dataSource.createEntityManager());
  }

  public async getIdByAccount(account: string) {
    return await this.createQueryBuilder('login')
      .where('login.account=:account', { account })
      .select(['login.id'])
      .getOne();
  }
}
