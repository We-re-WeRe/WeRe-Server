import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ReadLikeInfoDto } from './dto/read-like.dto';
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';
import { TargetTypes } from 'src/utils/types_and_enums';
import { UserId } from 'src/utils/custom_decorators';
import { AddAndRemoveLikeDto } from './dto/cud-like.dto';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likeService: LikesService) {}

  @ApiOperation({ summary: 'update webtoon like' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadLikeInfoDto,
  })
  @Patch()
  async addLike(
    @UserId() userId: number,
    @Query('targetType') targetType: TargetTypes,
    @Query('targetId') targetId: number,
  ): Promise<ReadLikeInfoDto> {
    try {
      if (!targetType)
        throw new CustomBadTypeRequestException('targetType', targetType);
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      const addAndRemoveLikeDto = new AddAndRemoveLikeDto(
        userId,
        targetType,
        targetId,
      );
      const result = await this.likeService.addLike(addAndRemoveLikeDto);
      return result;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'delete like' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadLikeInfoDto,
  })
  @Delete()
  async deleteLike(
    @UserId() userId: number,
    @Query('targetType') targetType: TargetTypes,
    @Query('targetId') targetId: number,
  ): Promise<ReadLikeInfoDto> {
    try {
      if (!targetType)
        throw new CustomBadTypeRequestException('targetType', targetType);
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      const addAndRemoveLikeDto = new AddAndRemoveLikeDto(
        userId,
        targetType,
        targetId,
      );
      const result = await this.likeService.softRemoveLike(addAndRemoveLikeDto);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
