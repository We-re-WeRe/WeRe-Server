import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { FollowDto } from './dto/follow.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  public async findOneDetailById(id: number) {
    return await this.createQueryBuilder('user')
      .where('user.id=:id', { id })
      .leftJoinAndSelect('user.followers', 'followers')
      .select(['user.id', 'user.imageURL', 'user.nickname', 'user.introduceMe'])
      .addSelect('COUNT(followers.id)', 'totalFollowers')
      .groupBy('user.id')
      .getRawOne();
  }

  public async findOneProfileImageById(id: number) {
    return await this.createQueryBuilder('user')
      .select(['user.id', 'user.imageURL', 'user.nickname'])
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
      .leftJoinAndSelect('user.followers', 'followers')
      .select(['user.id', 'user.imageURL', 'user.nickname', 'user.id'])
      .addSelect('COUNT(followers.id)', 'totalFollowers')
      .groupBy('user.id')
      .getRawOne();
  }

  public async getIdByNickname(nickname: string) {
    return await this.createQueryBuilder('user')
      .where('user.nickname=:nickname', { nickname })
      .select(['user.id'])
      .getOne();
  }

  public async findOneByIdAndtargetId(followDto: FollowDto) {
    const { id: userId, targetId } = followDto;
    return await this.createQueryBuilder('user')
      .where('user.id=:userId', { userId })
      .innerJoin('user.following', 'following', 'following.id=:targetId', {
        targetId,
      })
      .getExists();
  }

  /**
   * create user info
   * @param createUserDto
   * @returns
   */
  public async createUserInfo(createUserDto: CreateUserDto) {
    return await this.createQueryBuilder()
      .insert()
      .into(User)
      .values(createUserDto)
      .execute();
  }

  public async createFollowRelation(followDto: FollowDto) {
    return await this.createQueryBuilder()
      .relation(User, 'followers')
      .of(followDto.targetId)
      .add(followDto.id);
  }

  public async deleteFollowRelation(followDto: FollowDto) {
    return await this.createQueryBuilder()
      .relation(User, 'followers')
      .of(followDto.targetId)
      .remove(followDto.id);
  }
}
