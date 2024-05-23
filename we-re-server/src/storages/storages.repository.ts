import { Injectable } from '@nestjs/common';
import { Storage } from 'src/entities/storage.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateStorageDto } from './dto/create-storage.dto';
import { WebtoonInStorageDto } from './dto/webtoon-in-storage.dto';
import { CustomNotFoundException } from 'src/utils/custom_exceptions';

@Injectable()
export class StorageRepository extends Repository<Storage> {
  constructor(private readonly dataSource: DataSource) {
    super(Storage, dataSource.createEntityManager());
  }
  public async findOneDetailById(id: number) {
    return await this.createQueryBuilder('storage')
      .where('storage.id=:id', { id })
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
        'storage.explain',
        'storage.isPublic',
        'storage.user',
      ])
      .getRawOne();
  }

  public async findOneById(id: number) {
    return await this.createQueryBuilder('storage')
      .where('storage.id=:id', { id })
      .select(['storage.id', 'storage.user'])
      .getRawOne();
  }

  public async findManyPublicStorageList() {
    return await this.createQueryBuilder('storage')
      .where('storage.isPublic=true')
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
      ])
      .getRawMany();
  }

  public async findManyPublicStorageListByIds(ids: number[]) {
    return await this.createQueryBuilder('storage')
      .where('storage.isPublic=true')
      .andWhere('storage.id IN (:...ids)', { ids })
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
      ])
      .getRawMany();
  }

  public async findManyStorageListByUserId(userId: number, isMine: boolean) {
    const qb = this.createQueryBuilder('storage').where(
      'storage.user=:userId',
      { userId },
    );
    if (!isMine) qb.andWhere('storage.isPublic=true');
    return await qb
      .select([
        'storage.id',
        'storage.createdAt',
        'storage.imageURL',
        'storage.name',
      ])
      .getRawMany();
  }

  public async findManyPublicListByWebtoonId(webtoonId: number) {
    return await this.createQueryBuilder('storage')
      .where('storage.isPublic=true')
      .leftJoinAndSelect(
        'storage.webtoons',
        'webtoons',
        'webtoons.id = :webtoonId',
        { webtoonId },
      )
      .select(['storage.id', 'storage.imageURL', 'storage.name'])
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
        'webtoon',
        'webtoon.id=:webtoonId',
        {
          webtoonId: webtoonInStorageDto.webtoonId,
        },
      )
      .select(['storage.id', 'storage.user', 'webtoon.id'])
      .getRawOne();
  }

  public async createStorage(
    userId: number,
    createStorageDto: CreateStorageDto,
  ) {
    const { tags, ...tempCreateStorageDto } = createStorageDto;
    return await this.createQueryBuilder()
      .insert()
      .into(Storage)
      .values({
        ...tempCreateStorageDto,
        user: () => userId.toString(),
      })
      .execute();
  }

  public async addWebtoonAtStorage(webtoonInStorageDto: WebtoonInStorageDto) {
    return await this.createQueryBuilder()
      .relation(Storage, 'webtoons')
      .of(webtoonInStorageDto.id)
      .add(webtoonInStorageDto.webtoonId)
      .catch(() => {
        throw new CustomNotFoundException('webtoonId');
      });
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
