import { Injectable, Logger } from '@nestjs/common';
import {
  AddAndRemoveTagDto,
  AddAndRemoveTagRequestDto,
} from './dto/process-tag.dto';
import { TagRepository } from './tags.repository';
import { ReadTagDto } from './dto/read-tag.dto';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CreateTagDto } from './dto/create-tag.dto';
import { CustomBadTypeRequestException } from 'src/utils/custom_exceptions';

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

  async getAddAndRemoveTagDto(
    addAndRemoveTagRequestDto: AddAndRemoveTagRequestDto,
  ): Promise<AddAndRemoveTagDto> {
    const { tagType, targetId, contentsArray } = addAndRemoveTagRequestDto;
    const addAndRemoveTagDto = new AddAndRemoveTagDto();
    const alreadyTags = await this.findTagsByTargetId(tagType, targetId);
    const notDeleteIds = new Map<number, number>();
    for (const newContents of contentsArray) {
      let FLAG = true;
      for (const tag of alreadyTags) {
        if (tag.contents === newContents) {
          FLAG = false;
          notDeleteIds.set(tag.id, 1);
          break;
        }
      }
      for (const contents of addAndRemoveTagDto.contentsArray) {
        if (contents === newContents) {
          FLAG = false;
          break;
        }
      }
      if (FLAG) addAndRemoveTagDto.addContents(newContents);
    }

    for (const tag of alreadyTags) {
      if (!notDeleteIds.has(tag.id)) addAndRemoveTagDto.addDeleteId(tag.id);
    }
    if (
      alreadyTags.length -
        addAndRemoveTagDto.deleteIds.length +
        addAndRemoveTagDto.contentsArray.length >
      5
    ) {
      // 배열 길이 체크해달라는 예외처리 구현해조.
      throw new CustomBadTypeRequestException(
        'contentsArray->5',
        contentsArray,
      );
    }
    return addAndRemoveTagDto;
  }

  async addAndRemoveTag(addAndRemoveTagRequestDto: AddAndRemoveTagRequestDto) {
    const { contentsArray, deleteIds } = await this.getAddAndRemoveTagDto(
      addAndRemoveTagRequestDto,
    );
    const contentsArrayLength = contentsArray.length;
    const deleteIdsLength = deleteIds.length;
    let i = 0;
    for (i; i < Math.min(contentsArrayLength, deleteIdsLength); i++) {
      const updateTagDto = new UpdateTagDto(deleteIds[i], contentsArray[i]);
      await this.updateTag(updateTagDto);
    }
    for (i; i < contentsArrayLength; i++) {
      const createTagDto = new CreateTagDto(
        addAndRemoveTagRequestDto.tagType,
        addAndRemoveTagRequestDto.targetId,
        contentsArray[i],
      );
      await this.createTag(createTagDto);
    }
    for (i; i < deleteIdsLength; i++) {
      await this.deleteTag(deleteIds[i]);
    }
    const result = this.findTagsByTargetId(
      addAndRemoveTagRequestDto.tagType,
      addAndRemoveTagRequestDto.targetId,
    );
    return result;
  }

  async createTag(createTagDto: CreateTagDto): Promise<void> {
    await this.tagRepository.createTag(createTagDto);
    return;
  }

  async updateTag(updateTagDto: UpdateTagDto): Promise<void> {
    await this.tagRepository.update(updateTagDto.id, { ...updateTagDto });
    return;
  }

  async deleteTag(id: number): Promise<void> {
    await this.tagRepository.delete(id);
    return;
  }
}
