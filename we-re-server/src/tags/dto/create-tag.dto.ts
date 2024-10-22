import { TargetTypes } from 'src/utils/types_and_enums';

export class CreateTagDto {
  constructor(tagType: TargetTypes, targetId: number, contents: string) {
    this.tagType = tagType;
    this.targetId = targetId;
    this.contents = contents;
  }
  tagType: TargetTypes;

  targetId: number;

  contents: string;
}
