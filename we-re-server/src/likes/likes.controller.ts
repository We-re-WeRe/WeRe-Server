import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ReadLikeInfoDto } from './dto/read-like.dto';
import {
  CustomBadTypeRequestException,
  CustomUnauthorziedException,
} from 'src/utils/custom_exceptions';
import { AddAndRemoveLikeDto } from './dto/cud-like.dto';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @ApiOperation({ summary: 'update webtoon like' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadLikeInfoDto,
  })
  @Post('type/:likeType/targetId/:targetId')
  async addWebtoonLike(
    @Param('likeType') likeType: 'webtoon' | 'review' | 'storage',
    @Param('targetId') targetId: number,
    @Body() addAndRemoveLikeDto: AddAndRemoveLikeDto,
  ): Promise<ReadLikeInfoDto> {
    try {
      if (!likeType)
        throw new CustomBadTypeRequestException('likeType', likeType);
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      if (
        targetId !== addAndRemoveLikeDto.targetId ||
        likeType !== addAndRemoveLikeDto.likeType
      )
        throw new BadRequestException(`Param is different with Body's.`);
      const result = await this.likeService.addLike(addAndRemoveLikeDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete like' })
  @ApiCreatedResponse({
    description: 'Request Success',
    type: ReadLikeInfoDto,
  })
  @Delete('type/:likeType/targetId/:targetId')
  async deleteLike(
    @Param('likeType') likeType: 'webtoon' | 'review' | 'storage',
    @Param('targetId') targetId: number,
    @Body() addAndRemoveLikeDto: AddAndRemoveLikeDto,
  ): Promise<ReadLikeInfoDto> {
    try {
      if (!likeType)
        throw new CustomBadTypeRequestException('likeType', likeType);
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      if (
        targetId !== addAndRemoveLikeDto.targetId ||
        likeType !== addAndRemoveLikeDto.likeType
      )
        throw new BadRequestException(`Param is different with Body's.`);
      const result = await this.likeService.softRemoveLike(addAndRemoveLikeDto);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
