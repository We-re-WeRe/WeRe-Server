import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { TARGET_TYPES, TargetTypes } from 'src/utils/types_and_enums';

export class LikeRequestDto {
  constructor(userId: number, targetType: TargetTypes, targetId: number) {
    this.userId = userId;
    this.targetType = targetType;
    this.targetId = targetId;
  }
  @IsInt()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsEnum(TARGET_TYPES)
  @IsNotEmpty()
  targetType: TargetTypes;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetId: number;

  public setUserId(userId: number) {
    this.userId = userId;
  }
}
