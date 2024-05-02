import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReadTagDto } from './dto/read-tag.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'get Tag list at storage/review by each Id' })
  @ApiOkResponse({
    description: 'Request Success',
    type: ReadTagDto,
  })
  @Get('tag-type/:tagType/target-id/:targetId')
  async findTagsByTargetId(
    @Param('tagType') tagType: TargetTypes,
    @Param('targetId') targetId: number,
  ) {
    try {
      if (!TARGET_TYPES[tagType.toUpperCase()])
        // 예외 처리 다시 해줘야할듯. 새로운 exception 생성이 맞을 듯하다! 하면서 다른 exception들도 정리하자
        // 지금은 string이라 안됀요 원래 targettype으로 나오는게 베스트일듯.
        throw new CustomBadTypeRequestException('tagType', tagType);
      if (!targetId)
        throw new CustomBadTypeRequestException('targetId', targetId);
      return await this.tagsService.findTagsByTargetId(tagType, targetId);
    } catch (error) {
      throw error;
    }
  }
}
