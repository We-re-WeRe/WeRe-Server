import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';

export class AddAndRemoveTagRequestDto {
  constructor(
    targetType: TargetTypes,
    targetId: number,
    contentsArray: string[],
  ) {
    this.targetType = targetType;
    this.targetId = targetId;
    this.contentsArray = contentsArray ?? [];
  }
  @ApiProperty()
  @IsEnum(TARGET_TYPES)
  @IsNotEmpty()
  targetType: TargetTypes;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetId: number;

  @ApiProperty()
  @IsArray()
  @ArrayMaxSize(5)
  @MaxLength(10, {
    each: true,
  })
  @IsNotEmpty()
  contentsArray: string[];
}

export class AddAndRemoveTagDto {
  constructor() {
    this.contentsArray = [];
    this.deleteIds = [];
  }
  contentsArray: string[];

  deleteIds: number[];

  public addDeleteId(deleteId: number) {
    this.deleteIds.push(deleteId);
  }
  public addContents(contents: string) {
    this.contentsArray.push(contents);
  }
}
