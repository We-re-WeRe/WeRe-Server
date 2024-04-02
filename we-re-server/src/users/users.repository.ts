import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public async findOneDetailById(id: number) {
    return await this.createQueryBuilder('user')
      .where('user.id=:id', { id })
      .leftJoinAndSelect('user.following', 'followers')
      .select(['user.id', 'user.imageURL', 'user.nickname', 'user.introduceMe'])
      .addSelect('COUNT(followers.id)', 'totalFollowers')
      .getRawOne();
  }

  public async findOneProfileImageById(id: number) {
    return await this.createQueryBuilder('user')
      .select(['user.id', 'user.imageURL'])
      .where('id=:id', { id })
      .getRawOne();
  }

  /**
   * get user breif infos.
   * @param id userId
   * @returns {User} user breif infos
   */
  public async findOneBriefById(id: number) {
    return await this.createQueryBuilder('user')
      .where('user.id=:id', { id })
      .leftJoinAndSelect('user.following', 'followers')
      .select(['user.id', 'user.imageURL', 'user.nickname', 'user.id'])
      .addSelect('COUNT(followers.id)', 'totalFollowers')
      .getRawOne();
  }
}
