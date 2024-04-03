import { Injectable } from '@nestjs/common';
import { Review } from 'src/entities/review.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private readonly datasource: DataSource) {
    super(Review, datasource.createEntityManager());
  }
  public async findManyByUserId(userId: number): Promise<Review[]> {
    return await this.createQueryBuilder('review')
      .where('review.user=:userId', { userId })
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('review.webtoon', 'webtoon')
      .select([
        'review.id',
        'review.contents',
        'review.starPoint',
        'webtoon.id',
        'webtoon.title',
        'webtoon.imageURL',
        'webtoon.author',
        'webtoon.painter',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .groupBy('review.id')
      .getRawMany();
  }

  public async findManyByWebtoonId(webtoonId: number): Promise<Review[]> {
    return await this.createQueryBuilder('review')
      .where('review.webtoon_id=:webtoonId', { webtoonId })
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('review.user', 'user')
      .select([
        'review.id',
        'review.contents',
        'review.starPoint',
        'user.id',
        'user.nickname',
        'user.imageURL',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .groupBy('review.id')
      .getRawMany();
  }
}
