import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Logger,
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
  CustomNotFoundException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import {
  stringToDays,
  stringToProvidingCompany,
} from 'src/entities/webtoon.entity';

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
    @Param('id') id: number,
  ): Promise<ReadWebtoonDetailDto> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      const result = await this.webtoonsService.findOneDetailById(id);
      result.storages = await this.storageService.findManyPublicListByWebtoonId(
        id,
      );
      result.reviews = await this.reviewService.findManyByWebtoonId(id);
      return result;
    } catch (error) {
      throw error;
    }
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
    @Param('userId') userId: number,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    try {
      if (!userId) throw new CustomBadTypeRequestException('userId', userId);
      // TODO:: 본인인지 체크 필요.
      const { webtoonIds: ids } =
        await this.likeService.findManyWebtoonIdsByUserId(userId);
      return this.webtoonsService.findManyThumbnailByIds(ids);
    } catch (error) {
      throw error;
    }
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
    try {
      return this.webtoonsService.findManyNewThumbnail();
    } catch (error) {
      throw error;
    }
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
    try {
      return this.webtoonsService.findManyHotThumbnail();
    } catch (error) {
      throw error;
    }
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
    @Param('storageId') storageId: number,
  ): Promise<ReadWebtoonBriefDto[]> {
    try {
      if (!storageId)
        throw new CustomBadTypeRequestException('storageId', storageId);
      const { webtoonIds: ids, userId } =
        await this.storageService.findWebtoonIdListById(storageId);
      const result =
        await this.webtoonsService.findManyBreifInfoWithReviewByUserId(
          ids,
          userId,
        );
      return result;
    } catch (error) {
      throw error;
    }
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
    try {
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
    } catch (error) {
      throw error;
    }
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
    try {
      return await this.webtoonsService.createWebtoon(createWebtoonDto);
    } catch (error) {
      throw error;
    }
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
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      if (id !== updateWebtoonDto.id)
        throw new CustomUnauthorziedException(`id is wrong.`);
      return await this.webtoonsService.updateWebtoon(updateWebtoonDto);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete Webtoon' })
  @ApiNoContentResponse({ description: 'Request Success' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteWebtoon(@Param('id') id: number): Promise<void> {
    try {
      if (!id) throw new CustomBadTypeRequestException('id', id);
      return await this.webtoonsService.deleteWebtoon(id);
    } catch (error) {
      throw error;
    }
  }
}
