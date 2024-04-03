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
  ReadWebtoonDetailDto,
  ReadWebtoonThumbnailDto,
} from './dto/read-webtoon.dto';
import { StoragesService } from 'src/storages/storages.service';
import { ReviewsService } from 'src/reviews/reviews.service';

@Controller('webtoons')
export class WebtoonsController {
  constructor(
    private readonly webtoonsService: WebtoonsService,
    private readonly likeService: LikesService,
    private readonly storageService: StoragesService,
    private readonly reviewService: ReviewsService,
  ) {}

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

  @Get('list/liked/user/:userId')
  async findManyLikedThumbnailByUserId(
    @Param('userId') userId: string,
  ): Promise<ReadWebtoonThumbnailDto[]> {
    // TODO:: 본인인지 체크 필요.
    const { webtoonIds: ids } =
      await this.likeService.findManyWebtoonIdsByUserId(+userId);
    return this.webtoonsService.findManyThumbnailByIds(ids);
  }

  @Get('list/new')
  findManyNewThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyNewThumbnail();
  }

  @Get('list/hot')
  findManyHotThumbnail(): Promise<ReadWebtoonThumbnailDto[]> {
    return this.webtoonsService.findManyHotThumbnail();
  }

  @Get('list/storage/:storageId')
  async findManyBreifInfoWithReviewByStorageId(
    @Param('storageId') storageId: string,
  ) {
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

  @Get('list/filter/day/:day/providing-company/:providingCompany')
  findManyFilteredThumbnail(
    @Param('day') day: string,
    @Param('providingCompany') providingCompany: string,
  ) {
    return this.webtoonsService.findManyFilteredThumbnail(
      day,
      providingCompany,
    );
  }
}
