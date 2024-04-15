import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';
import { LikesService } from 'src/likes/likes.service';
import {
  ReadWebtoonBriefDto,
  ReadWebtoonDetailDto,
  ReadWebtoonThumbnailDto,
} from './dto/read-webtoon.dto';
import { StoragesService } from 'src/storages/storages.service';
import { ReviewsService } from 'src/reviews/reviews.service';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Webtoons')
@Controller('webtoons')
export class WebtoonsController {
  constructor(
    private readonly webtoonsService: WebtoonsService,
    private readonly likeService: LikesService,
    private readonly storageService: StoragesService,
    private readonly reviewService: ReviewsService,
  ) {}

  @ApiOperation({ summary: 'get Webtoon detail' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Get('detail/:id')
  async findOneDetailById(
    @Param('id') id: string,
  ): Promise<ReadWebtoonDetailDto> {
    const result = await this.webtoonsService.findOneDetailById(+id);
    result.storages = await this.storageService.findManyPublicListByWebtoonId(
      +id,
    );
    result.reviews = await this.reviewService.findManyByWebtoonId(+id);
    return result;
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is liked by user',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Get('list/liked/user/:userId')
  async findManyLikedThumbnailByUserId(
    @Param('userId') userId: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    // TODO:: 본인인지 체크 필요.
    const { webtoonIds: ids } =
      await this.likeService.findManyWebtoonIdsByUserId(+userId);
    return this.webtoonsService.findManyThumbnailByIds(ids);
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is new updated',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Get('list/new')
  findManyNewThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyNewThumbnail();
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is hot updated',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Get('list/hot')
  findManyHotThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyHotThumbnail();
  }

  @ApiOperation({
    summary: 'get Webtoon Brief List which is in Storage',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonBriefDto],
  })
  @Get('list/storage/:storageId')
  async findManyBreifInfoWithReviewByStorageId(
    @Param('storageId') storageId: string,
  ): Promise<ReadWebtoonBriefDto[]> {
    // TODO:: NULL일때 Error 처리 필요.
    const { webtoonIds: ids, userId } =
      await this.storageService.findWebtoonIdListById(+storageId);
    const result =
      await this.webtoonsService.findManyBreifInfoWithReviewByStorageId(
        ids,
        userId,
      );
    return result;
  }

  @ApiOperation({
    summary:
      'get Webtoon Thumbnail List which is Filtered by Day and Providing Company',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Get('list/filter/day/:day/providing-company/:providingCompany')
  findManyFilteredThumbnail(
    @Param('day') day: string,
    @Param('providingCompany') providingCompany: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyFilteredThumbnail(
      day,
      providingCompany,
    );
  }

  @ApiOperation({ summary: 'create Webtoon' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Post()
  async createWebtoon(
    @Body() createWebtoonDto: CreateWebtoonDto,
  ): Promise<ReadWebtoonDetailDto> {
    return await this.webtoonsService.createWebtoon(createWebtoonDto);
  }

  @ApiOperation({ summary: 'update Webtoon' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Patch(':id')
  async updateWebtoon(
    @Param('id') id: number,
    @Body() updateWebtoonDto: UpdateWebtoonDto,
  ): Promise<ReadWebtoonDetailDto> {
    return await this.webtoonsService.updateWebtoon(updateWebtoonDto);
  }

  @ApiOperation({ summary: 'delete Webtoon' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @Delete(':id')
  deleteReview(@Param('id') id: number): Promise<void> {
    // 삭제 잘 되었다는 status code 반환~
    return this.webtoonsService.deleteWebtoon(id);
  }
}
