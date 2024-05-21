import { Injectable } from '@nestjs/common';
import { Like } from 'src/entities/like.entity';
import { DataSource, Repository } from 'typeorm';
import { AddAndRemoveLikeDto } from './dto/cud-like.dto';

@Injectable()
export class LikesRepository extends Repository<Like> {
  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

  public async findManyStorageIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.user=:userId', { userId })
      .andWhere('likes.storage IS NOT NULL')
      .select(['likes.storage'])
      .getRawMany();
  }

  public async findManyWebtoonIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.user=:userId', { userId })
      .andWhere('likes.webtoon IS NOT NULL')
      .select(['likes.webtoon'])
      .getRawMany();
  }

  public async findManyReviewIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.userId=:userId', { userId })
      .andWhere('likes.review IS NOT NULL')
      .select(['likes.review'])
      .getRawMany();
  }

  public async findIsLiked(addAndRemoveLikeDto: AddAndRemoveLikeDto) {
    const { userId, targetType, targetId } = addAndRemoveLikeDto;
    return this.createQueryBuilder('likes')
      .where('likes.user=:userId', { userId })
      .andWhere(`likes.${targetType}=:targetId`, { targetId })
      .withDeleted()
      .getOne();
  }

  public async getLikeCount(addAndRemoveLikeDto: AddAndRemoveLikeDto) {
    const { targetType, targetId } = addAndRemoveLikeDto;
    return this.createQueryBuilder('likes')
      .where(`likes.${targetType}=:targetId`, { targetId })
      .select('COUNT(likes.id) as count')
      .getRawOne();
  }

  public async createLike(addAndRemoveLikeDto: AddAndRemoveLikeDto) {
    const { userId, targetType, targetId } = addAndRemoveLikeDto;
    const values = {
      user: () => `${userId}`,
    };
    values[targetType] = () => `${targetId}`;
    return await this.createQueryBuilder()
      .insert()
      .into(Like)
      .values({ ...values })
      .execute();
  }

  public async updateLike(id: number) {
    return await this.createQueryBuilder()
      .where('id = :id', { id })
      .restore()
      .execute();
  }
}
