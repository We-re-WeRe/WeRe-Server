import { Injectable } from '@nestjs/common';
import { Review } from 'src/entities/review.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewRepository extends Repository<Review> {
  constructor(private readonly datasource: DataSource) {
    super(Review, datasource.createEntityManager());
  }
  public async findOneById(id: number) {
    return await this.createQueryBuilder('review')
      .where('review.id=:id', { id })
      .select([
        'review.id',
        'review.contents',
        'review.starPoint',
        'review.createdAt',
        'review.user',
      ])
      .getRawOne();
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
        'review.createdAt',
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
        'review.createdAt',
        'user.id',
        'user.nickname',
        'user.imageURL',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .groupBy('review.id')
      .getRawMany();
  }

  public async createReview(userId: number, createReviewDto: CreateReviewDto) {
    return await this.createQueryBuilder()
      .insert()
      .into(Review)
      .values({
        user: () => userId.toString(),
        webtoon: () => createReviewDto.getStringWebtoonId(),
        contents: createReviewDto.contents,
        starPoint: createReviewDto.starPoint,
      })
      .execute();
  }
}
