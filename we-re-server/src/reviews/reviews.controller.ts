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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Review } from 'src/entities/review.entity';

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

  @ApiOperation({ summary: 'create Review' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: Review,
  })
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return this.reviewsService.createReview(createReviewDto);
  }

  @ApiOperation({ summary: 'update Review' })
  @ApiOkResponse({
    description: 'Request Success',
    type: Review,
  })
  @Patch(':id')
  updateReview(@Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
    // param id와 dto 내 id 체크로 자격 여부 판단하는거도 ㄱㅊ할듯
    return this.reviewsService.updateReview(updateReviewDto);
  }
}
