import { Injectable } from '@nestjs/common';
import { Review } from 'src/entities/review.entity';
import { Webtoon } from 'src/entities/webtoon.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WebtoonRepository extends Repository<Webtoon> {
  constructor(private readonly dataSource: DataSource) {
    super(Webtoon, dataSource.createEntityManager());
  }
  public async findOneDetailById(id: number) {
    // TODO:: starpoint가 중복된다. distinct도 사용 불가.
    // 서브쿼리로 변경해야할듯? 데이터 양이 많아지면 시간 잡아먹는 괴물이 될 것 같다.
    return await this.createQueryBuilder('webtoon')
      .where('webtoon.id=:id', { id })
      .leftJoinAndSelect('webtoon.likes', 'likes')
      .leftJoinAndSelect('webtoon.reviews', 'reviews')
      .leftJoinAndSelect('webtoon.storages', 'storages')
      .select([
        'webtoon.title',
        'webtoon.imageURL',
        'webtoon.webtoonURL',
        'webtoon.author',
        'webtoon.painter',
        'webtoon.providingCompany',
        'webtoon.day',
        'webtoon.genre',
        'webtoon.explain',
        'webtoon.viewCount',
      ])
      .groupBy('webtoon.id')
      .addGroupBy('storages.id')
      .addSelect('COUNT(DISTINCT(likes.id))', 'totalLikes')
      .addSelect('ROUND(AVG(reviews.starPoint),1)', 'totalStarPoint')
      .addSelect('storages.id')
      .getRawMany();
  }

  public async findManyThumbnailByIds(ids: number[]) {
    return await this.createQueryBuilder('webtoon')
      .where('webtoon.id IN (:...ids)', { ids })
      .select([
        'webtoon.id',
        'webtoon.title',
        'webtoon.imageURL',
        'webtoon.author',
        'webtoon.painter',
      ])
      .getMany();
  }

  public async findManyBreifInfoWithReviewByIds(ids: number[], userId: number) {
    return await this.createQueryBuilder('webtoon')
      .where('webtoon.id IN (:...ids)', { ids })
      .leftJoinAndSelect('webtoon.likes', 'likes')
      .leftJoinAndSelect(
        (qb) =>
          qb
            .select([
              'reviews.id',
              'reviews.starPoint',
              'reviews.contents',
              'reviews.webtoonId',
            ])
            .from(Review, 'reviews')
            .leftJoin('reviews.likes', 'reviewLikes')
            .where('reviews.userId = :userId', { userId })
            .addSelect('COUNT(reviewLikes.id)', 'totalLikes')
            .groupBy('reviews.id'),
        'reviews',
        'reviews.webtoonId = webtoon.id',
      )
      .select([
        'webtoon.id',
        'webtoon.title',
        'webtoon.imageURL',
        'webtoon.author',
        'webtoon.painter',
        'reviews_id',
        'reviews_starPoint',
        'reviews_contents',
        'reviews.totalLikes as totalReviewLikes',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .groupBy('webtoon.id')
      .addGroupBy('reviews_id')
      .getRawMany();
  }
}
