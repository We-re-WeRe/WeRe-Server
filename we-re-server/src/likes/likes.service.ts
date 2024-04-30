import { Injectable, Logger } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

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
}
