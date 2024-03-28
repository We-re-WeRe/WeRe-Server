import { Injectable } from '@nestjs/common';
import { Like } from 'src/entities/like.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LikesRepository extends Repository<Like> {
  constructor(private readonly dataSource: DataSource) {
    super(Like, dataSource.createEntityManager());
  }

  public async findManyStorageIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.userId=:userId', { userId })
      .andWhere('likes.storageId IS NOT NULL')
      .select(['likes.storageId'])
      .getRawMany();
  }

  public async findManyWebtoonIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.userId=:userId', { userId })
      .andWhere('likes.webtoonId IS NOT NULL')
      .select(['likes.webtoonId'])
      .getRawMany();
  }

  public async findManyReviewIdsByUserId(userId: number) {
    return this.createQueryBuilder('likes')
      .where('likes.userId=:userId', { userId })
      .andWhere('likes.reviewId IS NOT NULL')
      .select(['likes.reviewId'])
      .getRawMany();
  }
}
