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

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  /**
   * get user's reviews with webtoon info.
   * @param userId
   * @returns {Promise<[ReadReviewAndWebtoonDto]>}
   */
  async findManyByUserId(userId: number): Promise<ReadReviewAndWebtoonDto[]> {
    const queryResult = await this.reviewRepository.findManyByUserId(userId);
    const result = queryResult.map((r) => new ReadReviewAndWebtoonDto(r));
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
    const queryResult = await this.reviewRepository.createReview(
      createReviewDto,
    );
    const id = queryResult.identifiers[0].id;
    if (!id) {
      throw new CustomDataBaseException('create is not worked.');
    }
    const result = await this.reviewRepository.findOneBy(id);
    return result;
  }

  /**
   * update review and return updated review.
   * @param updateReviewDto id and fields
   * @returns {Promise<Review>}
   */
  async updateReview(updateReviewDto: UpdateReviewDto): Promise<Review> {
    const queryResult = await this.reviewRepository.update(
      updateReviewDto.id,
      updateReviewDto,
    );
    if (!queryResult.affected) {
      throw new CustomNotFoundException('id');
    }
    const result = await this.reviewRepository.findOneBy({
      id: updateReviewDto.id,
    });
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
