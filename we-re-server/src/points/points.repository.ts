import { Injectable } from '@nestjs/common';
import { Point } from 'src/entities/point.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PointRepository extends Repository<Point> {
  constructor(private dataSource: DataSource) {
    super(Point, dataSource.createEntityManager());
  }

  public async findHistoryById(user_id: number): Promise<Point[]> {
    return await this.createQueryBuilder('point')
      .select(['point.mount', 'point.reason', 'point.created_at'])
      .where('point.user=:user_id', { user_id })
      .orderBy('point.created_at', 'DESC')
      .getMany();
  }

  public async findSumById(user_id: number) {
    return await this.createQueryBuilder('point')
      .select(['SUM(point.mount) as totalPoint'])
      .where('point.user=:user_id', { user_id })
      .getRawOne();
  }
}
