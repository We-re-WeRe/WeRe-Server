import { Injectable } from '@nestjs/common';
import { Webtoon } from 'src/entities/webtoon.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WebtoonRepository extends Repository<Webtoon> {
  constructor(private readonly dataSource: DataSource) {
    super(Webtoon, dataSource.createEntityManager());
  }
  public async findOneDetailById(id: number) {
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
}
