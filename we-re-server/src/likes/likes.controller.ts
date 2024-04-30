import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ReadLikeInfoDto } from './dto/read-like.dto';
import { AddAndRemoveWebtoonLikeDto } from './dto/cud-like.dto';
import {
  CustomBadTypeRequestException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @Post('webtoon/:webtoonId')
  async addLike(
    @Param('webtoonId') webtoonId: number,
    @Body() addAndRemoveWebtoonLikeDto: AddAndRemoveWebtoonLikeDto,
  ): Promise<ReadLikeInfoDto> {
    try {
      if (!webtoonId)
        throw new CustomBadTypeRequestException('webtoonId', webtoonId);
      if (webtoonId !== addAndRemoveWebtoonLikeDto.webtoonId)
        throw new BadRequestException(
          `Param webtoonId is different with Body's.`,
        );
      const isLiked = await this.likeService.findIsLiked(
        addAndRemoveWebtoonLikeDto,
      );
      // 업뎃
      //   if (!isLiked) {
      //   }
      const result = await this.likeService.getLikeCount(
        addAndRemoveWebtoonLikeDto,
      );
      // 데이터 받아오기
      return result;
    } catch (error) {
      throw error;
    }
  }
}
