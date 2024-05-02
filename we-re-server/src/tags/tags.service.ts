import { Injectable, Logger } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagRepository } from './tags.repository';
import { ReadTagDto } from './dto/read-tag.dto';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';

@Injectable()
export class TagsService {
  constructor(private readonly tagRepository: TagRepository) {}
  async findTagsByTargetId(
    targetType: TargetTypes,
    reviewId: number,
  ): Promise<ReadTagDto[]> {
    const queryResult = await this.tagRepository.findTagsByTargetId(
      targetType,
      reviewId,
    );
    const result = queryResult.map((r) => new ReadTagDto(r));
    return result;
  }

  async checkIsDuplicate(
    targetType: TargetTypes,
    targetId: number,
    inputs: string[],
  ): Promise<boolean> {
    let FLAG = false;
    const alreadyTags = await this.findTagsByTargetId(targetType, targetId);
    for (const tag of alreadyTags) {
      for (const input of inputs) {
        if (tag.contents === input) {
          FLAG = true;
          return FLAG;
        }
      }
    }
    return FLAG;
  }
}
