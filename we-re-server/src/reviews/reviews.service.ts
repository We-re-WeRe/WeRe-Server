import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './reviews.repository';
import {
  ReadReviewAndUserDto,
  ReadReviewAndWebtoonDto,
  ReadReviewDto,
} from './dto/read-review.dto';
import {
  CustomDataAlreadyExistException,
  CustomDataBaseException,
  CustomNotFoundException,
  CustomUnauthorziedException,
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
    // TODO:: map으로 일일이 하는게 빠를까 id리스트 가져와서 그거로 tag 찾고 일일이 맵핑해주는게 조을까
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
  async createReview(
    userId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<ReadReviewDto> {
    const alreadyReview = await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        webtoon: { id: createReviewDto.webtoonId },
      },
    });
    if (alreadyReview) {
      throw new CustomDataAlreadyExistException(
        'This User already has a Review for this Webtoon.',
      );
    }
    const queryResult = await this.reviewRepository.createReview(
      userId,
      createReviewDto,
    );
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    const result = await this.reviewRepository.findOneById(id);
    const readReviewDto = new ReadReviewDto(result);
    const { tags } = createReviewDto;
    const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
      TARGET_TYPES.REVIEW,
      id,
      tags,
    );
    readReviewDto.tags = await this.tagsService.addAndRemoveTag(
      addAndRemoveTagRequestDto,
    );

    return readReviewDto;
  }

  /**
   * update review and return updated review.
   * @param updateReviewDto id and fields
   * @returns {Promise<Review>}
   */
  async updateReview(
    userId: number,
    updateReviewDto: UpdateReviewDto,
  ): Promise<ReadReviewDto> {
    const { tags, id, ...tempUpdateReviewDto } = updateReviewDto;
    await this.checkReviewOwner(id, userId);
    const queryResult = await this.reviewRepository.update(
      id,
      tempUpdateReviewDto,
    );
    if (!queryResult.affected) {
      throw new CustomNotFoundException('id');
    }
    const result = await this.reviewRepository.findOneById(id);
    const readReviewDto = new ReadReviewDto(result);
    const addAndRemoveTagRequestDto = new AddAndRemoveTagRequestDto(
      TARGET_TYPES.REVIEW,
      result.id,
      tags,
    );
    readReviewDto.tags = await this.tagsService.addAndRemoveTag(
      addAndRemoveTagRequestDto,
    );

    return readReviewDto;
  }

  async deleteReview(id: number, userId: number): Promise<void> {
    await this.checkReviewOwner(id, userId);
    const queryResult = await this.reviewRepository.delete(id);
    if (!queryResult) {
      throw new CustomNotFoundException('id');
    }
    return;
  }

  async checkReviewOwner(id: number, userId: number): Promise<void> {
    const queryResult = await this.reviewRepository.findOneById(id);
    if (queryResult.user_id == userId)
      throw new CustomUnauthorziedException("you can't change review");
  }
}
