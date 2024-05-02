import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
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
import {
  CustomBadTypeRequestException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';

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
  async findManyByUserId(
    @Param('userId') userId: number,
  ): Promise<ReadReviewAndWebtoonDto[]> {
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      const result = await this.reviewsService.findManyByUserId(userId);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'create Review' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: Review,
  })
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    try {
      return this.reviewsService.createReview(createReviewDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'update Review' })
  @ApiOkResponse({
    description: 'Request Success',
    type: Review,
  })
  @Patch(':id')
  updateReview(
    @Param('id') id: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<Review> {
    // param id와 dto 내 id 체크로 자격 여부 판단하는거도 ㄱㅊ할듯
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      if (id !== updateReviewDto.id)
        throw new CustomUnauthorziedException(`id is wrong.`);
      return this.reviewsService.updateReview(updateReviewDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete Review' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteReview(@Param('id') id: number): Promise<void> {
    // 삭제 잘 되었다는 status code 반환~
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return this.reviewsService.deleteReview(id);
    } catch (error) {
      throw error;
    }
  }
}
