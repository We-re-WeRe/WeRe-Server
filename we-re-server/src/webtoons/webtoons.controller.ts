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

@Controller('webtoons')
export class WebtoonsController {
  constructor(private readonly webtoonsService: WebtoonsService) {}

  @Get('detail/:id')
  findOneDetailById(@Param('id') id: string) {
    return this.webtoonsService.findOneDetailById(+id);
  }

  @Get('liked-list/user/:userId')
  findManyLikedThumbnailByUserId(@Param('userId') userId: string) {
    return this.webtoonsService.findManyLikedThumbnailByUserId(+userId);
  }

  @Get('list/storage/:storageId')
  findManyBreifInfoWithReviewByStorageId(
    @Param('storageId') storageId: string,
  ) {
    return this.webtoonsService.findManyBreifInfoWithReviewByStorageId(
      +storageId,
    );
  }
}
