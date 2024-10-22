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
} from 'src/utils/custom_exceptions';
import { LikesService } from 'src/likes/likes.service';
import { LikeRequestDto } from 'src/likes/dto/cud-like.dto';
import { TagsService } from 'src/tags/tags.service';
import { TARGET_TYPES } from 'src/utils/types_and_enums';
import { AddAndRemoveTagRequestDto } from 'src/tags/dto/process-tag.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly likesService: LikesService,
    private readonly tagsService: TagsService,
  ) {}

  /**
   * get user's reviews with webtoon info.
   * @param ownerId
   * @returns {Promise<[ReadReviewAndWebtoonDto]>}
   */
  async findManyByOwnerId(
    userId: number,
    ownerId: number,
  ): Promise<ReadReviewAndWebtoonDto[]> {
    const queryResult = await this.reviewRepository.findManyByOwnerId(ownerId);
    const result = await Promise.all(
      queryResult.map(async (r) => {
        const temp = new ReadReviewAndWebtoonDto(r);
        await this.allocateTagAndLikesInReviewDto(temp, userId);
        temp.setIsMine(userId, ownerId);
        return temp;
      }),
    );
    return result;
  }

  /**
   * get webtoon's reviews with user info.
   * @param webtoonId
   * @returns {Promise<[ReadReviewAndUserDto]>}
   */
  async findManyByWebtoonId(
    userId: number,
    webtoonId: number,
  ): Promise<ReadReviewAndUserDto[]> {
    const queryResult = await this.reviewRepository.findManyByWebtoonId(
      webtoonId,
    );
    const result = await Promise.all(
      queryResult.map(async (r) => {
        const temp = new ReadReviewAndUserDto(r);
        await this.allocateTagAndLikesInReviewDto(temp, userId);
        temp.setIsMine(userId, temp.user.id);
        return temp;
      }),
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
   * get review dto with owner and webtoon id
   * @param userId
   * @param ownerId
   * @param webtoonId
   * @returns
   */
  async findOneByOwnerAndWebtoonId(
    userId: number,
    ownerId: number,
    webtoonId: number,
  ): Promise<ReadReviewDto> {
    const queryResult = await this.reviewRepository.findOneByOwnerAndWebtoonId(
      userId,
      webtoonId,
    );
    const result = new ReadReviewDto(queryResult);
    if (queryResult) {
      await this.allocateTagAndLikesInReviewDto(result, userId);
      result.setIsMine(userId, ownerId);
    }

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
    if (queryResult.user_id !== userId)
      throw new CustomNotFoundException('userId');
  }

  private async allocateTagAndLikesInReviewDto(
    readReviewDto: ReadReviewDto,
    userId: number,
  ) {
    const addAndRemoveLikeDto = new LikeRequestDto(
      userId,
      TARGET_TYPES.REVIEW,
      readReviewDto.id,
    );
    readReviewDto.like = await this.likesService.getReadLikeInfoDto(
      addAndRemoveLikeDto,
    );
    readReviewDto.tags = await this.tagsService.findTagsByTargetId(
      TARGET_TYPES.REVIEW,
      readReviewDto.id,
    );
  }
}
