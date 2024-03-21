import { Injectable } from '@nestjs/common';
import { Storage, DISCLOSURESCOPE } from 'src/entities/storage.entity';
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

  public async findManyPublicStorageList(): Promise<Storage[]> {
    return await this.createQueryBuilder('storage')
      .where('storage.disclosureScope=:disclosureScope', {
        disclosureScope: DISCLOSURESCOPE.PUBLIC,
      })
      .leftJoinAndSelect('storage.likes', 'likes')
      .select(['storage.id', 'storage.imageURL', 'storage.name'])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .orderBy('totalLikes', 'DESC')
      .groupBy('storage.id')
      .getRawMany();
  }

  public async findManyPublicStorageListByIds(
    ids: number[],
  ): Promise<Storage[]> {
    return await this.createQueryBuilder('storage')
      .where('storage.disclosureScope=:disclosureScope', {
        disclosureScope: DISCLOSURESCOPE.PUBLIC,
      })
      .andWhere('storage.id IN (:...ids)', { ids })
      .leftJoinAndSelect('storage.likes', 'likes')
      .select(['storage.id', 'storage.imageURL', 'storage.name'])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .orderBy('totalLikes', 'DESC')
      .groupBy('storage.id')
      .getRawMany();
  }
}
