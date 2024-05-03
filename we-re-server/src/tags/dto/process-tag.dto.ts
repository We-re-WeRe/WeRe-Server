import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';

export class AddAndRemoveTagRequestDto {
  @ApiProperty()
  @IsEnum(TARGET_TYPES)
  @IsNotEmpty()
  tagType: TargetTypes;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetId: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  contentsArray: string[];
}

export class AddAndRemoveTagDto {
  constructor() {
    this.contentsArray = [];
    this.deleteIds = [];
  }
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  contentsArray: string[];

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  deleteIds: number[];

  public addDeleteId(deleteId: number) {
    this.deleteIds.push(deleteId);
  }
  public addContents(contents: string) {
    this.contentsArray.push(contents);
  }
}
