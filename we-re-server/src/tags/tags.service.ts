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
    targetId: number,
  ): Promise<ReadTagDto[]> {
    const queryResult = await this.tagRepository.findTagsByTargetId(
      targetType,
      targetId,
    );
    const result = queryResult.map((r) => new ReadTagDto(r));
    return result;
  }

  async getNotDuplicatedContents(
    targetType: TargetTypes,
    targetId: number,
    inputs: string[],
  ): Promise<string[]> {
    const contents: string[] = [];
    const alreadyTags = await this.findTagsByTargetId(targetType, targetId);
    for (const input of inputs) {
      let FLAG = true;
      for (const tag of alreadyTags) {
        if (tag.contents === input) {
          FLAG = false;
          break;
        }
      }
      Logger.log(FLAG, input);
      if (FLAG) contents.push(input);
    }
    return contents;
  }
}
