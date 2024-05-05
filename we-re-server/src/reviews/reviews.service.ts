import { Injectable, Logger } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './reviews.repository';
import {
  ReadReviewAndUserDto,
  ReadReviewAndWebtoonDto,
  ReadReviewDto,
} from './dto/read-review.dto';
import { Review } from 'src/entities/review.entity';
import {
  CustomDataAlreadyExistException,
  CustomDataBaseException,
  CustomNotFoundException,
} from 'src/utils/custom_exceptions';
import { TagsService } from 'src/tags/tags.service';
import { TARGET_TYPES } from 'src/utils/types_and_enums';
import { AddAndRemoveTagRequestDto } from 'src/tags/dto/process-tag.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * get user's reviews with webtoon info.
   * @param userId
   * @returns {Promise<[ReadReviewAndWebtoonDto]>}
   */
  async findManyByUserId(userId: number): Promise<ReadReviewAndWebtoonDto[]> {
    const queryResult = await this.reviewRepository.findManyByUserId(userId);
    const result = queryResult.map((r) => new ReadReviewAndWebtoonDto(r));
    await Promise.all(
      result.map(
        async (r) =>
          (r.tags = await this.tagsService.findTagsByTargetId(
            TARGET_TYPES.REVIEW,
            r.id,
          )),
      ),
    );
    return result;
  }

  /**
   * get webtoon's reviews with user info.
   * @param webtoonId
   * @returns {Promise<[ReadReviewAndUserDto]>}
   */
  async findManyByWebtoonId(
    webtoonId: number,
  ): Promise<ReadReviewAndUserDto[]> {
    const queryResult = await this.reviewRepository.findManyByWebtoonId(
      webtoonId,
    );
    const result: ReadReviewAndUserDto[] = queryResult.map(
      (r) => new ReadReviewAndUserDto(r),
    );
    await Promise.all(
      result.map(
        async (r) =>
          (r.tags = await this.tagsService.findTagsByTargetId(
            TARGET_TYPES.REVIEW,
            r.id,
          )),
      ),
    );
    return result;
  }

  /**
   * create new review and return new review.
   * @param createReviewDto user id and webtoon id
   * @returns {Promise<Review>}
   */
  async createReview(createReviewDto: CreateReviewDto): Promise<Review> {
    const alreadyReview = await this.reviewRepository.findOne({
      where: {
        user: { id: +createReviewDto.userId },
        webtoon: { id: +createReviewDto.webtoonId },
      },
    });
    if (alreadyReview) {
      throw new CustomDataAlreadyExistException(
        'This User already has a Review for this Webtoon.',
      );
    }
    const { tags, ...tempCreateReviewDto } = createReviewDto;
    const queryResult = await this.reviewRepository.createReview(
      tempCreateReviewDto,
    );
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    const result = await this.reviewRepository.findOneBy({ id });
    if (!!tags) {
      const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
        TARGET_TYPES.REVIEW,
        id,
        tags,
      );
      await this.tagsService.addAndRemoveTag(addAndRemoveTagRequestDto);
    }
    return result;
  }

  /**
   * update review and return updated review.
   * @param updateReviewDto id and fields
   * @returns {Promise<Review>}
   */
  async updateReview(updateReviewDto: UpdateReviewDto): Promise<Review> {
    const { tags, ...tempUpdateReviewDto } = updateReviewDto;
    const queryResult = await this.reviewRepository.update(
      tempUpdateReviewDto.id,
      tempUpdateReviewDto,
    );
    if (!queryResult.affected) {
      throw new CustomNotFoundException('id');
    }
    const result = await this.reviewRepository.findOneBy({
      id: tempUpdateReviewDto.id,
    });
    if (!!tags) {
      const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
        TARGET_TYPES.REVIEW,
        result.id,
        tags,
      );
      await this.tagsService.addAndRemoveTag(addAndRemoveTagRequestDto);
    }
    return result;
  }

  async deleteReview(id: number): Promise<void> {
    const queryResult = await this.reviewRepository.delete(id);
    if (!queryResult) {
      throw new CustomNotFoundException('id');
    }
    return;
  }
}
