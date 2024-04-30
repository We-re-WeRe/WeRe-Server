import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'update like' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadLikeInfoDto,
  })
  @Post('webtoon/:webtoonId')
  async addWebtoonLike(
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
      const result = await this.likeService.addLike(addAndRemoveWebtoonLikeDto);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
