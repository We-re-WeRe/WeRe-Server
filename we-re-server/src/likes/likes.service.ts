import { Injectable, Logger } from '@nestjs/common';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(private readonly likeRepository: LikesRepository) {}

  async findManyStorageIdsByUserId(id: number) {
    const storage_id_object_arr =
      await this.likeRepository.findManyStorageIdsByUserId(id);
    const storage_ids = [];
    storage_id_object_arr.forEach((r) => storage_ids.push(r.storageId));
    const result = { storage_ids };
    return result;
  }

  async findManyWebtoonIdsByUserId(id: number) {
    const webtoon_id_object_arr =
      await this.likeRepository.findManyWebtoonIdsByUserId(id);
    const webtoon_ids = [];
    webtoon_id_object_arr.forEach((r) => webtoon_ids.push(r.webtoonId));
    const result = { webtoon_ids };
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
