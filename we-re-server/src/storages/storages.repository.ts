import { Injectable } from '@nestjs/common';
import { Storage } from 'src/entities/storage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private readonly dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }
  public async findOneDetailById(id: number): Promise<Storage> {
    return await this.createQueryBuilder('storage')
      .where('storage.id=:id', { id })
      .leftJoinAndSelect('storage.likes', 'likes')
      .select([
        'storage.imageURL',
        'storage.name',
        'storage.explain',
        'storage.disclosureScope',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .getRawOne();
  }

  public async findOneProfileImageById(id: number) {
    return await this.createQueryBuilder('user')
      .select(['imageURL'])
      .where('id=:id', { id })
      .getRawOne();
  }
}
