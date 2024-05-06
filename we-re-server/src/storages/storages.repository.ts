import { Injectable } from '@nestjs/common';
import { Storage } from 'src/entities/storage.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateStorageDto } from './dto/create-storage.dto';
import { WebtoonInStorageDto } from './dto/webtoon-in-storage.dto';

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
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
        'storage.explain',
        'storage.isPublic',
        'storage.user_id',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .groupBy('storage.id')
      .getRawOne();
  }

  public async findManyPublicStorageList() {
    return await this.createQueryBuilder('storage')
      .where('storage.isPublic=true')
      .leftJoinAndSelect('storage.likes', 'likes')
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .orderBy('totalLikes', 'DESC')
      .groupBy('storage.id')
      .getRawMany();
  }

  public async findManyPublicStorageListByIds(ids: number[]) {
    return await this.createQueryBuilder('storage')
      .where('storage.isPublic=true')
      .andWhere('storage.id IN (:...ids)', { ids })
      .leftJoinAndSelect('storage.likes', 'likes')
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .orderBy('totalLikes', 'DESC')
      .groupBy('storage.id')
      .getRawMany();
  }

  public async findManyStorageListByUserId(userId: number, isMe: boolean) {
    const qb = this.createQueryBuilder('storage').where(
      'storage.user=:userId',
      { userId },
    );
    if (!isMe) qb.andWhere('storage.isPublic=true');
    return await qb
      .leftJoinAndSelect('storage.likes', 'likes')
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
      ])
      .addSelect('COUNT(likes.id)', 'totalLikes')
      .orderBy('totalLikes', 'DESC')
      .groupBy('storage.id')
      .getRawMany();
  }

  public async findManyPublicListByWebtoonId(webtoonId: number) {
    return await this.createQueryBuilder('storage')
      .where('storage.isPublic=true')
      .leftJoinAndSelect('storage.likes', 'likes')
      .leftJoinAndSelect(
        'storage.webtoons',
        'webtoons',
        'webtoons.id = :webtoonId',
        { webtoonId },
      )
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

  public async findStorageWebtoonRelationById(
    webtoonInStorageDto: WebtoonInStorageDto,
  ) {
    return await this.createQueryBuilder('storage')
      .where('storage.id=:id', { id: webtoonInStorageDto.id })
      .leftJoinAndSelect(
        'storage.webtoons',
        'webtoons',
        'webtoons.id=:webtoonId',
        {
          webtoonId: webtoonInStorageDto.webtoonId,
        },
      )
      .select(['storage.id', 'webtoons.id'])
      .getRawOne();
  }

  public async createStorage(createStorageDto: CreateStorageDto) {
    const { tags, ...tempCreateStorageDto } = createStorageDto;
    return await this.createQueryBuilder()
      .insert()
      .into(Storage)
      .values({
        ...tempCreateStorageDto,
        user: () => createStorageDto.getStringUserId(),
      })
      .execute();
  }

  public async addWebtoonAtStorage(webtoonInStorageDto: WebtoonInStorageDto) {
    return await this.createQueryBuilder()
      .relation(Storage, 'webtoons')
      .of(webtoonInStorageDto.id)
      .add(webtoonInStorageDto.webtoonId);
  }

  public async removeWebtoonAtStorage(
    webtoonInStorageDto: WebtoonInStorageDto,
  ) {
    return await this.createQueryBuilder()
      .relation(Storage, 'webtoons')
      .of(webtoonInStorageDto.id)
      .remove(webtoonInStorageDto.webtoonId);
  }
}
