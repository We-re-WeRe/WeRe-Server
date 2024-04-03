import { Injectable, Logger } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikesRepository) {}

  async findManyStorageIdsByUserId(id: number) {
    const storage_id_object_arr =
      await this.likeRepository.findManyStorageIdsByUserId(id);
    const storage_ids = [];
    storage_id_object_arr.forEach((r) => storage_ids.push(r.storage_id));
    const result = { storage_ids };
    return result;
  }

  async findManyWebtoonIdsByUserId(id: number) {
    const webtoon_id_object_arr =
      await this.likeRepository.findManyWebtoonIdsByUserId(id);
    const webtoonIds = [];
    webtoon_id_object_arr.forEach((r) => webtoonIds.push(r.webtoon_id));
    const result = { webtoonIds };
    return result;
  }

  async findManyReviewIdsByUserId(id: number) {
    const review_id_object_arr =
      await this.likeRepository.findManyReviewIdsByUserId(id);
    const review_ids = [];
    review_id_object_arr.forEach((r) => review_ids.push(r.reviewId));
    const result = { review_ids };
    return result;
  }
}
