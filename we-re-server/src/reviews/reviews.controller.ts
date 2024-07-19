import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReadReviewAndWebtoonDto, ReadReviewDto } from './dto/read-review.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Review } from 'src/entities/review.entity';
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';
import { Public, UserId } from 'src/utils/custom_decorators';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'get Review List by User id' })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadReviewAndWebtoonDto],
  })
  @Public()
  @Get('list/user')
  async findManyByUserId(
    @UserId() userId: number,
    @Query('ownerId') ownerId: number,
  ): Promise<ReadReviewAndWebtoonDto[]> {
    if (!ownerId)
      if (userId) ownerId = userId;
      else throw new CustomBadTypeRequestException('ownerId', ownerId);
    const result = await this.reviewsService.findManyByOwnerId(userId, ownerId);
    return result;
  }

  @ApiOperation({ summary: 'create Review' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: Review,
  })
  @Post()
  createReview(
    @UserId() userId: number,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReadReviewDto> {
    return this.reviewsService.createReview(userId, createReviewDto);
  }

  @ApiOperation({ summary: 'update Review' })
  @ApiOkResponse({
    description: 'Request Success',
    type: Review,
  })
  @Patch()
  updateReview(
    @UserId() userId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReadReviewDto> {
    return this.reviewsService.updateReview(userId, updateReviewDto);
  }

  @ApiOperation({ summary: 'delete Review' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteReview(
    @UserId() userId: number,
    @Query('id') id: number,
  ): Promise<void> {
    if (!id) throw new CustomBadTypeRequestException('id', id);
    return this.reviewsService.deleteReview(id, userId);
  }
}
