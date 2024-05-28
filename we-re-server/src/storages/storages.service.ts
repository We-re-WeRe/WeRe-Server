import { Injectable, Logger } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';
import {
  ReadMyStorageBriefDto,
  ReadStorageBriefDto,
  ReadStorageDetailDto,
} from './dto/read-storage.dto';
import { WebtoonInStorageDto } from './dto/webtoon-in-storage.dto';
import {
  CustomDataAlreadyExistException,
  CustomDataBaseException,
  CustomNotFoundException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import { LikesService } from 'src/likes/likes.service';
import { TARGET_TYPES } from 'src/utils/types_and_enums';
import { LikeRequestDto } from 'src/likes/dto/cud-like.dto';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class StoragesService {
  constructor(
    private readonly storageRepository: StorageRepository,
    private readonly likesService: LikesService,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * get Storage Detail for storage page.
   * @param id storage id
   * @returns storage detail and user brief info
   */
  async findOneDetailById(
    id: number,
    userId: number,
  ): Promise<ReadStorageDetailDto> {
    const queryResult = await this.storageRepository.findOneDetailById(id);
    if (!queryResult) throw new CustomNotFoundException('storageId');
    const result = new ReadStorageDetailDto(queryResult);
    result.setIsMine(userId);
    if (!result.isMine && !result.isPublic)
      throw new CustomUnauthorziedException('you cant access private');
    result.tags = await this.tagsService.findTagsByTargetId(
      TARGET_TYPES.STORAGE,
      id,
    );
    const likeRequestDto = new LikeRequestDto(userId, TARGET_TYPES.STORAGE, id);
    result.like = await this.likesService.getReadLikeInfoDto(likeRequestDto);
    return result;
  }

  /**
   * Service to get all publis storage list.
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyPublicStorageList(
    userId: number,
  ): Promise<ReadStorageBriefDto[]> {
    const queryResult =
      await this.storageRepository.findManyPublicStorageList();
    const result: ReadStorageBriefDto[] = queryResult.map(
      (r) => new ReadStorageBriefDto(r),
    );
    await this.allocateLikeInStorageDtoArray(result, userId);
    return result;
  }

  async findManyMyStorageList(
    userId: number,
    webtoonId: number,
  ): Promise<ReadMyStorageBriefDto[]> {
    const queryResult = await this.storageRepository.findManyMyStorageList(
      userId,
    );
    const result = queryResult.map((r) => {
      const temp = new ReadMyStorageBriefDto(r, webtoonId);
      return temp;
    });
    return result;
  }

  /**
   * Service to get user's storage list
   * @param {number} userId
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyStorageListByUserId(
    userId: number,
    ownerId: number,
  ): Promise<ReadStorageBriefDto[]> {
    const isMine = userId === ownerId;
    const queryResult =
      await this.storageRepository.findManyStorageListByUserId(ownerId, isMine);
    const result: ReadStorageBriefDto[] = queryResult.map(
      (r) => new ReadStorageBriefDto(r),
    );
    await this.allocateLikeInStorageDtoArray(result, userId);
    return result;
  }

  /**
   * Service to get webtoon's storage list
   * @param {number} webtoonId
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyPublicListByWebtoonId(
    userId: number,
    webtoonId: number,
  ): Promise<ReadStorageBriefDto[]> {
    const queryResult =
      await this.storageRepository.findManyPublicListByWebtoonId(webtoonId);
    const result: ReadStorageBriefDto[] = queryResult.map(
      (r) => new ReadStorageBriefDto(r),
    );
    await this.allocateLikeInStorageDtoArray(result, userId);
    return result;
  }

  /**
   * Service to get with storage Ids
   * @param ids
   * @returns {ReadStorageBriefDto[]}
   */
  async findManyPublicStorageListByIds(
    userId: number,
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
      await this.allocateLikeInStorageDtoArray(result, userId);
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
    userId: number,
    createStorageDto: CreateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    const queryResult = await this.storageRepository.createStorage(
      userId,
      createStorageDto,
    );
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    const result = await this.findOneDetailById(userId, id);
    return result;
  }

  /**
   * update storage and return storage detail
   * @param updateStorageDto
   * @returns {Promise<ReadStorageDetailDto>}
   */
  async updateStorage(
    userId: number,
    updateStorageDto: UpdateStorageDto,
  ): Promise<ReadStorageDetailDto> {
    const { tags, ...tempUpdateStorageDto } = updateStorageDto;
    await this.checkStorageIsValid(updateStorageDto.id, userId);
    const queryResult = await this.storageRepository.update(
      tempUpdateStorageDto.id,
      tempUpdateStorageDto,
    );
    if (!queryResult.affected) {
      throw new CustomDataBaseException('something wrong in Database');
    }
    const result = await this.findOneDetailById(
      userId,
      tempUpdateStorageDto.id,
    );
    return result;
  }

  async checkStorageIsValid(id: number, userId: number) {
    const queryResult = await this.storageRepository.findOneById(id);
    if (!queryResult) throw new CustomNotFoundException('storageId');
    this.checkStorageOwner(userId, queryResult);
    return true;
  }

  checkStorageOwner(userId: number, queryResult: any) {
    if (queryResult.user_id !== userId)
      throw new CustomUnauthorziedException("you can't change");
  }

  /**
   * check webtoon storage relation.
   * @param webtoonInStorageDto id and webtoonId
   * @returns {boolean}
   */
  async checkerStorageWebtoonRelation(
    userId: number,
    webtoonInStorageDto: WebtoonInStorageDto,
  ): Promise<void> {
    const queryResult =
      await this.storageRepository.findStorageWebtoonRelationById(
        webtoonInStorageDto,
      );
    if (queryResult) {
      if (!queryResult.webtoon_id) {
        this.checkStorageOwner(userId, queryResult);
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
  async addWebtoonAtStorage(
    userId: number,
    webtoonInStorageDto: WebtoonInStorageDto,
  ) {
    await this.checkerStorageWebtoonRelation(userId, webtoonInStorageDto);
    await this.storageRepository.addWebtoonAtStorage(webtoonInStorageDto);
  }

  /**
   * remove webtoon to storage.
   * @param webtoonInStorageDto id and webtoonId
   */
  async removeWebtoonAtStorage(
    userId: number,
    webtoonInStorageDto: WebtoonInStorageDto,
  ) {
    await this.checkStorageIsValid(webtoonInStorageDto.id, userId);
    await this.storageRepository.removeWebtoonAtStorage(webtoonInStorageDto);
  }

  async deleteStorage(id: number, userId: number): Promise<void> {
    await this.checkStorageIsValid(id, userId);
    const queryResult = await this.storageRepository.delete(id);
    if (!queryResult) {
      throw new CustomNotFoundException('id');
    }
    return;
  }

  private async allocateLikeInStorageDtoArray(
    result: ReadStorageBriefDto[],
    userId: number,
  ) {
    await Promise.all(
      result.map(async (r) => {
        const likeRequestDto = new LikeRequestDto(
          userId,
          TARGET_TYPES.STORAGE,
          r.id,
        );
        r.like = await this.likesService.getReadLikeInfoDto(likeRequestDto);
      }),
    );
  }
}
