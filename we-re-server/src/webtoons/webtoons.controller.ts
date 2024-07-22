import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
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
import {
  CustomBadTypeRequestException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import {
  stringToDays,
  stringToProvidingCompany,
} from 'src/entities/webtoon.entity';
import { Public, UserId } from 'src/utils/custom_decorators';

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
  @Public()
  @Get('detail')
  async findOneDetailById(
    @UserId() userId: number,
    @Query('id') id: number,
  ): Promise<ReadWebtoonDetailDto> {
    if (!id) throw new CustomBadTypeRequestException('id', id);
    const result = await this.webtoonsService.findOneDetailById(id, userId);
    result.storages = await this.storageService.findManyPublicListByWebtoonId(
      userId,
      id,
    );
    result.reviews = await this.reviewService.findManyByWebtoonId(userId, id);
    return result;
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is liked by user',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Get('list/liked')
  async findManyLikedThumbnailByUserId(
    @UserId() userId: number,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    const { webtoonIds: ids } =
      await this.likeService.findManyWebtoonIdsByUserId(userId);
    return this.webtoonsService.findManyThumbnailByIds(ids);
  }

  @ApiOperation({
    summary: 'get Webtoon Thumbnail List which is new updated',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: [ReadWebtoonThumbnailDto],
  })
  @Public()
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
  @Public()
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
  @Public()
  @Get('list/storage')
  async findManyBreifInfoWithReviewByStorageId(
    @UserId() userId: number,
    @Query('storageId') storageId: number,
  ): Promise<ReadWebtoonBriefDto[]> {
    if (!storageId)
      throw new CustomBadTypeRequestException('storageId', storageId);
    const { webtoonIds: ids, userId: ownerId } =
      await this.storageService.findWebtoonIdListById(storageId);
    const result =
      await this.webtoonsService.findManyBreifInfoWithReviewByOwnerId(
        ids,
        ownerId,
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
  @Public()
  @Get('list/filtered-by')
  findManyFilteredThumbnail(
    @Query('day') day: string,
    @Query('providingCompany') providingCompany: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    if (!stringToDays(day)) {
      throw new CustomBadTypeRequestException('day', day);
    }
    if (!stringToProvidingCompany(providingCompany)) {
      throw new CustomBadTypeRequestException(
        'providingCompany',
        providingCompany,
      );
    }
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
  @Public()
  @Post()
  async createWebtoon(@Body() createWebtoonDto: CreateWebtoonDto) {
    // 아무나 upload 못하게 해야할듯. webtoon 추가를 그냥 python에서 하든동.
    await this.webtoonsService.createWebtoon(createWebtoonDto);
    return;
  }

  @ApiOperation({ summary: 'update Webtoon' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadWebtoonDetailDto,
  })
  @Public()
  @Patch()
  async updateWebtoon(
    @Query('id') id: number,
    @Body() updateWebtoonDto: UpdateWebtoonDto,
  ) {
    if (!id) throw new CustomBadTypeRequestException('id', id);
    if (id !== updateWebtoonDto.id)
      throw new CustomUnauthorziedException(`id is wrong.`);
    await this.webtoonsService.updateWebtoon(updateWebtoonDto);
    return;
  }

  @ApiOperation({ summary: 'delete Webtoon' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async deleteWebtoon(@Query('id') id: number): Promise<void> {
    if (!id) throw new CustomBadTypeRequestException('id', id);
    return await this.webtoonsService.deleteWebtoon(id);
  }
}
