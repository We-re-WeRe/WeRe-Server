import { Injectable } from '@nestjs/common';
import {
  Storage,
  DISCLOSURESCOPE,
  DisclosureScope,
} from 'src/entities/storage.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private readonly dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }
  public async findOneDetailById(id: number) {
    return await this.createQueryBuilder('storage')
      .where('storage.id=:id', { id })
      .leftJoinAndSelect('storage.likes', 'likes')
      .select([
        'storage.id',
        'storage.imageURL',
        'storage.name',
        'storage.explain',
        'storage.disclosureScope',
        'storage.user_id',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .getRawOne();
  }

  public async findManyPublicStorageList() {
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

  public async findManyPublicStorageListByIds(ids: number[]) {
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

  public async findManyStorageListByUserId(
    userId: number,
    disclosureScope: DisclosureScope[],
  ) {
    return await this.createQueryBuilder('storage')
      .where('storage.user=:userId', { userId })
      .andWhere('storage.disclosureScope IN (:...disclosureScope)', {
        disclosureScope,
      })
      .leftJoinAndSelect('storage.likes', 'likes')
      .select(['storage.id', 'storage.imageURL', 'storage.name'])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .orderBy('totalLikes', 'DESC')
      .groupBy('storage.id')
      .getRawMany();
  }

  /**
   * get user id and webtoon id list related with storage.
   * @param id storage id
   * @returns {{any}[]} webtoon id list and storage owner's id
   */
  public async findWebtoonIdListById(id: number) {
    return await this.createQueryBuilder('storage')
      .where('storage.id=:id', { id })
      .leftJoinAndSelect('storage.webtoons', 'webtoons')
      .select(['storage.user', 'webtoons.id'])
      .getRawMany();
  }
}
