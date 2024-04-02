import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './reviews.repository';
import { ReadReviewAndUserDto } from './dto/read-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async findManyByUserId(id: number) {
    return this.reviewRepository.findManyByUserId(id);
  }
  async findManyByWebtoonId(id: number) {
    const queryResult = await this.reviewRepository.findManyByWebtoonId(+id);
    const result: ReadReviewAndUserDto[] = queryResult.map(
      (r) => new ReadReviewAndUserDto(r),
    );
    return result;
  }
}
