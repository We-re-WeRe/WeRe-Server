import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class ReadLikeInfoDto {
  constructor(isLike: boolean, raw: any) {
    this.isLike = isLike;
    this.rawToDto(raw);
  }

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isLike: boolean;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  count: number;

  public rawToDto(raw: any): ReadLikeInfoDto {
    this.count = raw.count;
    return this;
  }
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
