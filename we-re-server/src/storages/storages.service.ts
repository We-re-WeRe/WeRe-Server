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
      // storage id is not found. not found error handling!
      throw new Error();
    }
    const result = await this.findOneDetailById(updateStorageDto.id);
    return result;
  }

  /**
   * add webtoon to storage.
   * @param webtoonInStorageDto id and webtoonId
   */
  async addWebtoonToStorage(webtoonInStorageDto: WebtoonInStorageDto) {
    await this.storageRepository.addWebtoonToStorage(webtoonInStorageDto);
  }

  /**
   * remove webtoon to storage.
   * @param webtoonInStorageDto id and webtoonId
   */
  async removeWebtoonToStorage(webtoonInStorageDto: WebtoonInStorageDto) {
    await this.storageRepository.removeWebtoonToStorage(webtoonInStorageDto);
  }

  async deleteReview(id: number): Promise<void> {
    const queryResult = await this.storageRepository.delete(id);
    if (!queryResult) {
      // storage is not deleted. error handling plz.
      throw new Error();
    }
    return;
  }
}
