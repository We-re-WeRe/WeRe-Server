import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './reviews.repository';
import {
  ReadReviewAndUserDto,
  ReadReviewAndWebtoonDto,
} from './dto/read-review.dto';

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
}
