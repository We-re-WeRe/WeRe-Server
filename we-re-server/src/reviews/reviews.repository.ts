import { Injectable } from '@nestjs/common';
import { Review } from 'src/entities/review.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private readonly datasource: DataSource) {
    super(Review, datasource.createEntityManager());
  }
  public async findManyByUserId(id: number): Promise<Review[]> {
    return await this.createQueryBuilder('review')
      .where('review.userId=:id', { id })
      .leftJoinAndSelect('review.likes', 'likes')
      .leftJoinAndSelect('review.webtoon', 'webtoon')
      .select([
        'review.id',
        'review.contents as contents',
        'review.starpoint as starpoint',
        'webtoon.id',
        'webtoon.title',
        'webtoon.imageURL',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .groupBy('review.id')
      .getRawMany();
  }
}
