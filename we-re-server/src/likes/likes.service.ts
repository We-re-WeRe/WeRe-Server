import { Injectable, Logger } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import {
  AddAndRemoveLikeDto,
  AddAndRemoveReviewLikeDto,
  AddAndRemoveWebtoonLikeDto,
} from './dto/cud-like.dto';
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
   * @param addAndRemoveLikeDto webtoon, review, storage extends this object.
   * @returns {Promise<boolean>}
   */
  async findIsLiked(
    addAndRemoveLikeDto: AddAndRemoveLikeDto,
  ): Promise<ReadIsLikeInfoDto> {
    const queryResult = await this.likeRepository.findIsLiked(
      addAndRemoveLikeDto,
    );
    let isLike = false;
    const id = queryResult ? queryResult.id : -1;
    if (queryResult) {
      isLike = !!!queryResult.deletedAt;
    }
    const result = new ReadIsLikeInfoDto(isLike, id);
    return result;
  }

  /**
   * get like count and return do i like and count.
   * @param addAndRemoveLikeDto webtoon, review, storage extends this object.
   * @returns {Promise<boolean>}
   */
  async getLikeCount(
    addAndRemoveLikeDto: AddAndRemoveLikeDto,
  ): Promise<ReadLikeInfoDto> {
    const { isLike } = await this.findIsLiked(addAndRemoveLikeDto);
    const queryResult = await this.likeRepository.getLikeCount(
      addAndRemoveLikeDto,
    );
    const result = new ReadLikeInfoDto(isLike, queryResult);
    return result;
  }

  /**
   * add like.
   * @param addAndRemoveLikeDto webtoon, review, storage extends this object.
   * @returns {Promise<ReadLikeInfoDto>}
   */
  async addLike(
    addAndRemoveLikeDto: AddAndRemoveLikeDto,
  ): Promise<ReadLikeInfoDto> {
    const { id, isLike } = await this.findIsLiked(addAndRemoveLikeDto);
    if (!isLike) {
      let isWorked = true;
      if (id > 0) {
        const queryResult = await this.likeRepository.updateLike(id);
        isWorked = !!queryResult.affected;
      } else {
        const queryResult = await this.likeRepository.createLike(
          addAndRemoveLikeDto,
        );
        isWorked = !!queryResult.raw.affectedRows;
      }
      if (!isWorked)
        throw new CustomDataBaseException('update like is not worked');
    }
    return await this.getLikeCount(addAndRemoveLikeDto);
  }

  async softRemoveLike(
    addAndRemoveLikeDto: AddAndRemoveLikeDto,
  ): Promise<ReadLikeInfoDto> {
    const { id, isLike } = await this.findIsLiked(addAndRemoveLikeDto);
    if (isLike) {
      let isWorked = true;
      if (id > 0) {
        const queryResult = await this.likeRepository.softDelete(id);
        isWorked = !!queryResult.affected;
      }
      if (!isWorked)
        throw new CustomDataBaseException('update like is not worked');
    }
    return await this.getLikeCount(addAndRemoveLikeDto);
  }
}
