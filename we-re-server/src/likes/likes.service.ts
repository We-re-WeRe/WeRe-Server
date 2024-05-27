import { Injectable, Logger } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { LikeRequestDto } from './dto/cud-like.dto';
import { ReadIsLikeInfoDto, ReadLikeInfoDto } from './dto/read-like.dto';
import { CustomDataBaseException } from 'src/utils/custom_exceptions';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikesRepository) {}

  async findManyStorageIdsByUserId(id: number) {
    const storageIdObjectArr =
      await this.likeRepository.findManyStorageIdsByUserId(id);
    const storageIds = [];
    storageIdObjectArr.forEach((r) => storageIds.push(r.storageId));
    const result = { storageIds };
    return result;
  }

  async findManyWebtoonIdsByUserId(id: number) {
    const webtoonIdObjectArr =
      await this.likeRepository.findManyWebtoonIdsByUserId(id);
    const webtoonIds = [];
    webtoonIdObjectArr.forEach((r) => webtoonIds.push(r.webtoonId));
    const result = { webtoonIds };
    return result;
  }

  async findManyReviewIdsByUserId(id: number) {
    const reviewIdObjectArr =
      await this.likeRepository.findManyReviewIdsByUserId(id);
    const reviewIds = [];
    reviewIdObjectArr.forEach((r) => reviewIds.push(r.reviewId));
    const result = { reviewIds };
    return result;
  }
  /**
   * check user's like for target.
   * @param likeRequestDto webtoon, review, storage extends this object.
   * @returns {Promise<boolean>}
   */
  async findIsLiked(
    likeRequestDto: LikeRequestDto,
  ): Promise<ReadIsLikeInfoDto> {
    let isLike = false;
    let id = 0;
    if (likeRequestDto.userId) {
      const queryResult = await this.likeRepository.findIsLiked(likeRequestDto);
      if (queryResult) {
        isLike = !!!queryResult.deletedAt;
        id = queryResult.id;
      }
    }
    const result = new ReadIsLikeInfoDto(isLike, id);
    return result;
  }

  /**
   * get like count and return count.
   * @param likeRequestDto webtoon, review, storage extends this object.
   * @returns {Promise<boolean>}
   */
  async getLikeCount(likeRequestDto: LikeRequestDto): Promise<number> {
    const queryResult = await this.likeRepository.getLikeCount(likeRequestDto);
    const result: number = queryResult.count;
    return result;
  }

  /**
   * call functions to get read like info dto.
   * @param likeRequestDto
   * @returns
   */
  async getReadLikeInfoDto(
    likeRequestDto: LikeRequestDto,
  ): Promise<ReadLikeInfoDto> {
    const { isLike } = await this.findIsLiked(likeRequestDto);
    const count = await this.getLikeCount(likeRequestDto);
    const result = new ReadLikeInfoDto(isLike, count);
    Logger.log(JSON.stringify(result));
    return result;
  }

  /**
   * add like.
   * @param likeRequestDto webtoon, review, storage extends this object.
   * @returns {Promise<ReadLikeInfoDto>}
   */
  async addLike(likeRequestDto: LikeRequestDto): Promise<ReadLikeInfoDto> {
    const { id, isLike } = await this.findIsLiked(likeRequestDto);
    if (!isLike) {
      let isWorked = true;
      if (id > 0) {
        const queryResult = await this.likeRepository.updateLike(id);
        isWorked = !!queryResult.affected;
      } else {
        // if target id 가 없는 id일 경우 처리해줘야함.. 여기서 다른 service 받으면
        // circular dependency라.. 흠...
        const queryResult = await this.likeRepository.createLike(
          likeRequestDto,
        );
        isWorked = !!queryResult.raw.affectedRows;
      }
      if (!isWorked)
        throw new CustomDataBaseException('update like is not worked');
    }
    return await this.getReadLikeInfoDto(likeRequestDto);
  }

  /**
   * soft delete related like.
   * @param likeRequestDto
   * @returns {Promise<ReadLikeInfoDto>}
   */
  async softRemoveLike(
    likeRequestDto: LikeRequestDto,
  ): Promise<ReadLikeInfoDto> {
    const { id, isLike } = await this.findIsLiked(likeRequestDto);
    if (isLike) {
      let isWorked = true;
      if (id > 0) {
        const queryResult = await this.likeRepository.softDelete(id);
        isWorked = !!queryResult.affected;
      }
      if (!isWorked)
        throw new CustomDataBaseException('update like is not worked');
    }
    return await this.getReadLikeInfoDto(likeRequestDto);
  }
}
