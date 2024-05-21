import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TagsService } from './tags.service';
import { AddAndRemoveTagRequestDto } from './dto/process-tag.dto';
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReadTagDto } from './dto/read-tag.dto';
import { Public, UserId } from 'src/utils/custom_decorators';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'get Tag list at storage/review by each Id' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadTagDto,
  })
  @Public()
  @Get()
  async findTagsByTargetId(
    @Query('targetType') targetType: TargetTypes,
    @Query('targetId') targetId: number,
  ) {
    try {
      if (!TARGET_TYPES[targetType.toUpperCase()])
        // 예외 처리 다시 해줘야할듯. 새로운 exception 생성이 맞을 듯하다! 하면서 다른 exception들도 정리하자
        // 지금은 string이라 안됀요 원래 targettype으로 나오는게 베스트일듯.
        throw new CustomBadTypeRequestException('tagType', targetType);
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      return await this.tagsService.findTagsByTargetId(targetType, targetId);
    } catch (error) {
      throw error;
    }
  }

  // Deprecated
  @ApiOperation({
    summary:
      ':Deprecated: add and remove Tag list at storage/review by each Id',
  })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadTagDto,
  })
  @Post()
  async addAndRemoveTags(
    @UserId() userId: number,
    @Body() addAndRemoveTagRequestDto: AddAndRemoveTagRequestDto,
  ) {
    try {
      return await this.tagsService.addAndRemoveTag(addAndRemoveTagRequestDto);
    } catch (error) {
      throw error;
    }
  }
}
