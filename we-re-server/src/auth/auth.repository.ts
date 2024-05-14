import { Injectable } from '@nestjs/common';
import { Auth } from 'src/entities/auth.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateLocalAuthDto } from './dto/create-auth.dto';
import { LocalAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthRepository extends Repository<Auth> {
  constructor(private dataSource: DataSource) {
    super(Auth, dataSource.createEntityManager());
  }

  public async getIdByAccount(account: string) {
    return await this.createQueryBuilder('auth')
      .where('auth.account=:account', { account })
      .select(['auth.id'])
      .getOne();
  }

  public async localLogin(account: string) {
    return await this.createQueryBuilder('auth')
      .where('auth.account=:account', { account })
      .leftJoinAndSelect('auth.user', 'user')
      .getOne();
  }

  public async createUserAndAuth(auth: Auth) {
    return await this.dataSource.manager.save(auth);
  }
}