import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';

export class CreateTagDto {
  constructor(tagType: TargetTypes, targetId: number, contents: string) {
    this.tagType = tagType;
    this.targetId = targetId;
    this.contents = contents;
  }
  @ApiProperty()
  @IsEnum(TARGET_TYPES)
  @IsNotEmpty()
  tagType: TargetTypes;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contents: string;
}
