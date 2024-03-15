import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public async findOneWithDetailById(id: number): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.id=:id', { id })
      .leftJoinAndSelect('user.following', 'followers')
      .select(['user.imageURL', 'user.nickname', 'user.introduceMe'])
      .addSelect('COUNT(followers.id)', 'totalFollowers')
      .getRawOne();
  }

  public async findOneProfileImageById(id: number) {
    return await this.createQueryBuilder('user')
      .select(['imageURL'])
      .where('id=:id', { id })
      .getRawOne();
  }
}
