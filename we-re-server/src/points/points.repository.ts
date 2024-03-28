import { Injectable } from '@nestjs/common';
import { Point } from 'src/entities/point.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PointRepository extends Repository<Point> {
  constructor(private dataSource: DataSource) {
    super(Point, dataSource.createEntityManager());
  }

  public async findHistoryById(id: number): Promise<Point[]> {
    return await this.createQueryBuilder('point')
      .select(['point.mount', 'point.reason', 'point.created_at'])
      .where('point.user=:id', { id })
      .orderBy('point.created_at', 'DESC')
      .getMany();
  }

  public async findSumById(id: number) {
    return await this.createQueryBuilder('point')
      .select(['SUM(point.mount) as point_sum'])
      .where('point.user=:id', { id })
      .getRawOne();
  }
}
