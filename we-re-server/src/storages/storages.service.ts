import { Injectable, Logger } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import {
  ReadStorageBriefDto,
  ReadStorageDetailDto,
} from './dto/read-storage.dto';
import { WebtoonInStorageDto } from './dto/webtoon-in-storage.dto';
import {
  CustomDataAlreadyExistException,
  CustomDataBaseException,
  CustomNotFoundException,
} from 'src/utils/custom_exceptions';

@Injectable()
export class StoragesService {
  constructor(private readonly storageRepository: StorageRepository) {}

  /**
   * get Storage Detail for storage page.
   * @param id storage id
   * @returns storage detail and user brief info
   */
  async findOneDetailById(id: number): Promise<ReadStorageDetailDto> {
    const queryResult = await this.storageRepository.findOneDetailById(id);
    if (!queryResult) throw new CustomNotFoundException('storageId');
    const result = new ReadStorageDetailDto(queryResult);
    return result;
  }

  /**
   * Service to get all publis storage list.
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyPublicStorageList(): Promise<ReadStorageBriefDto[]> {
    const queryResult =
      await this.storageRepository.findManyPublicStorageList();
    const result: ReadStorageBriefDto[] = queryResult.map(
      (r) => new ReadStorageBriefDto(r),
    );
    return result;
  }

  /**
   * Service to get user's storage list
   * @param {number} userId
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyStorageListByUserId(
    userId: number,
  ): Promise<ReadStorageBriefDto[]> {
    //TODO:: disclosure scope 유저 login service에서 본인 판단 후 인자로 전달해줘야함.
    const isMe = false;
    const disclosureScope = isMe
      ? [DISCLOSURESCOPE.PUBLIC, DISCLOSURESCOPE.PRIVATE]
      : [DISCLOSURESCOPE.PUBLIC];

    const queryResult =
      await this.storageRepository.findManyStorageListByUserId(
        userId,
        disclosureScope,
      );
    const result: ReadStorageBriefDto[] = queryResult.map(
      (r) => new ReadStorageBriefDto(r),
    );
    return result;
  }

  /**
   * Service to get webtoon's storage list
   * @param {number} webtoonId
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyPublicListByWebtoonId(
    webtoonId: number,
  ): Promise<ReadStorageBriefDto[]> {
    const queryResult =
      await this.storageRepository.findManyPublicListByWebtoonId(webtoonId);
    const result: ReadStorageBriefDto[] = queryResult.map(
      (r) => new ReadStorageBriefDto(r),
    );
    return result;
  }

  /**
   * Service to get with storage Ids
   * @param ids
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyPublicStorageListByIds(
    ids: number[],
  ): Promise<ReadStorageBriefDto[]> {
    if (ids.length > 0) {
      //TODO:: ids 길이가 0이면 typeorm은 in query에서 오류를 뱉는다.
      // 이거 좀 더 이쁜 방식으로 해결해보자.
      const queryResult =
        await this.storageRepository.findManyPublicStorageListByIds(ids);
      const result: ReadStorageBriefDto[] = queryResult.map(
        (r) => new ReadStorageBriefDto(r),
      );
      return result;
    } else {
      return [];
    }
  }

  /**
   * get user id and webtoon id list related with storage.
   * @param id storage id
   * @returns {{userId,webtoonIds[]}}webtoon id list and storage owner's id
   */
  async findWebtoonIdListById(
    id: number,
  ): Promise<{ userId: number; webtoonIds: number[] }> {
    const queryResult = await this.storageRepository.findWebtoonIdListById(id);
    if (queryResult.length === 0) {
      return null;
    }
    const webtoonIds: number[] = [];
    const userId: number = queryResult[0].user_id;
    queryResult.forEach((r) => webtoonIds.push(r.webtoons_id));
    const result = { userId: userId, webtoonIds: webtoonIds };
    return result;
  }

  /**
   * create storage and return storage detail
   * @param createStorageDto
   * @returns {Promise<ReadStorageDetailDto>}
   */
  async createStorage(
    createStorageDto: CreateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    const queryResult = await this.storageRepository.createStorage(
      createStorageDto,
    );
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    const result = await this.findOneDetailById(id);
    return result;
  }

  /**
   * update storage and return storage detail
   * @param updateStorageDto
   * @returns {Promise<ReadStorageDetailDto>}
   */
  async updateStorage(
    updateStorageDto: UpdateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    const queryResult = await this.storageRepository.update(
      updateStorageDto.id,
      updateStorageDto,
    );
    if (!queryResult.affected) {
      throw new CustomNotFoundException('id');
    }
    const result = await this.findOneDetailById(updateStorageDto.id);
    return result;
  }

  /**
   * check webtoon storage relation.
   * @param webtoonInStorageDto id and webtoonId
   * @returns {boolean}
   */
  async checkerStorageWebtoonRelation(
    webtoonInStorageDto: WebtoonInStorageDto,
  ): Promise<void> {
    const result = await this.storageRepository.findStorageWebtoonRelationById(
      webtoonInStorageDto,
    );
    if (result) {
      if (!result.webtoons_id) {
        throw new CustomNotFoundException('webtoonId');
      } else {
        throw new CustomDataAlreadyExistException(
          'This webtoon is already in this Storage.',
        );
      }
    } else {
      throw new CustomNotFoundException('storageId');
    }
  }

  /**
   * add webtoon to storage.
   * @param webtoonInStorageDto id and webtoonId
   */
  async addWebtoonAtStorage(webtoonInStorageDto: WebtoonInStorageDto) {
    await this.checkerStorageWebtoonRelation(webtoonInStorageDto);
    await this.storageRepository.addWebtoonAtStorage(webtoonInStorageDto);
  }

  /**
   * remove webtoon to storage.
   * @param webtoonInStorageDto id and webtoonId
   */
  async removeWebtoonAtStorage(webtoonInStorageDto: WebtoonInStorageDto) {
    await this.storageRepository.removeWebtoonAtStorage(webtoonInStorageDto);
  }

  async deleteReview(id: number): Promise<void> {
    const queryResult = await this.storageRepository.delete(id);
    if (!queryResult) {
      throw new CustomNotFoundException('id');
    }
    return;
  }
}
