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
import { ReadReviewAndWebtoonDto, ReadReviewDto } from './dto/read-review.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'get Review List by User id' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadReviewAndWebtoonDto],
  })
  @Get('list/user/:userId')
  findManyByUserId(
    @Param('userId') userId: string,
  ): Promise<ReadReviewAndWebtoonDto[]> {
    return this.reviewsService.findManyByUserId(+userId);
  }

  @ApiOperation({ summary: 'get Review List by User id' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadReviewAndWebtoonDto],
  })
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.createReview(createReviewDto);
  }
}
