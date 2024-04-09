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

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async findManyByUserId(userId: number): Promise<ReadReviewAndWebtoonDto[]> {
    const queryResult = await this.reviewRepository.findManyByUserId(userId);
    const result = queryResult.map((r) => new ReadReviewAndWebtoonDto(r));
    return result;
  }

  async findManyByWebtoonId(
    webtoonId: number,
  ): Promise<ReadReviewAndUserDto[]> {
    const queryResult = await this.reviewRepository.findManyByWebtoonId(
      +webtoonId,
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
      // Error handling plz..!
      throw new Error();
    }
    const queryResult = await this.reviewRepository.createReview(
      createReviewDto,
    );
    const result = await this.reviewRepository.findOneBy(
      queryResult.identifiers[0].id,
    );
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
      // review id is not found. not found error handling!
      throw new Error();
    }
    const result = await this.reviewRepository.findOneBy({
      id: updateReviewDto.id,
    });
    return result;
  }
}
