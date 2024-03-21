import { Injectable } from '@nestjs/common';
import { Webtoon } from 'src/entities/webtoon.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WebtoonRepository extends Repository<Webtoon> {
  constructor(private readonly dataSource: DataSource) {
    super(Webtoon, dataSource.createEntityManager());
  }
}
