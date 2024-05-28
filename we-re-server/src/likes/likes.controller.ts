import { Controller, Delete, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';
import { ReadLikeInfoDto } from './dto/read-like.dto';
import { UserId } from 'src/utils/custom_decorators';
import { LikeRequestDto } from './dto/cud-like.dto';

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
    @Query() likeRequestDto: LikeRequestDto,
  ): Promise<ReadLikeInfoDto> {
    try {
      likeRequestDto.setUserId(userId);
      const result = await this.likeService.addLike(likeRequestDto);
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
    @Query() likeRequestDto: LikeRequestDto,
  ): Promise<ReadLikeInfoDto> {
    try {
      likeRequestDto.setUserId(userId);
      const result = await this.likeService.softRemoveLike(likeRequestDto);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
