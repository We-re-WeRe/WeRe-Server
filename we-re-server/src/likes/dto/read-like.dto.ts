import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class ReadLikeInfoDto {
  constructor(isLike: boolean, count: number) {
    this.isLike = isLike;
    this.count = count;
  }

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isLike: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  count: number;
}

export class ReadIsLikeInfoDto {
  constructor(isLike: boolean, id: number) {
    this.isLike = isLike;
    this.id = id;
  }
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsBoolean()
  @IsNotEmpty()
  isLike: boolean;
}
