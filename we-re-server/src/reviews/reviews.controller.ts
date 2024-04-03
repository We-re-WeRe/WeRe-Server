import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReadReviewAndWebtoonDto } from './dto/read-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('list/user/:userId')
  findManyByUserId(
    @Param('userId') userId: string,
  ): Promise<ReadReviewAndWebtoonDto[]> {
    return this.reviewsService.findManyByUserId(+userId);
  }
}
