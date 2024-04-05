import { Injectable } from '@nestjs/common';
import { Point } from 'src/entities/point.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePointDto } from './dto/create-point.dto';

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

  public async createPoint(createPointDto: CreatePointDto) {
    return await this.createQueryBuilder()
      .insert()
      .into(Point)
      .values({
        user: () => createPointDto.UserIdString,
        reason: createPointDto.Reason,
        mount: createPointDto.Mount,
      })
      .execute();
  }
}
