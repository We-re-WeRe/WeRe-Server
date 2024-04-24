import { Injectable } from '@nestjs/common';
import { Point } from 'src/entities/point.entity';
import { DataSource, Repository } from 'typeorm';
import { CreatePointDto } from './dto/create-point.dto';

@Injectable()
export class PointRepository extends Repository<Point> {
  constructor(private dataSource: DataSource) {
    super(Point, dataSource.createEntityManager());
  }

  public async findHistoryById(userId: number): Promise<Point[]> {
    return await this.createQueryBuilder('point')
      .select([
        'point.id',
        'point.user',
        'point.mount',
        'point.reason',
        'point.created_at',
      ])
      .where('point.user=:userId', { userId })
      .orderBy('point.created_at', 'DESC')
      .getMany();
  }

  public async findSumById(userId: number) {
    return await this.createQueryBuilder('point')
      .select(['SUM(point.mount) as totalPoint'])
      .where('point.user=:userId', { userId })
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

  public async delete(id: number) {
    return await this.createQueryBuilder()
      .delete()
      .from(Point)
      .where('id = :id', { id })
      .execute();
  }

  public async deleteByUserId(userId: number) {
    return await this.createQueryBuilder()
      .delete()
      .from(Point)
      .where('user = :userId', { userId })
      .execute();
  }
}
