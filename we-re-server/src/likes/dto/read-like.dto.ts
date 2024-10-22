import { ApiProperty } from '@nestjs/swagger';

export class ReadLikeInfoDto {
  constructor(isLike: boolean, count: number) {
    this.isLike = isLike;
    this.count = count;
  }
  @ApiProperty()
  isLike: boolean;

  @ApiProperty()
  count: number;
}

export class ReadIsLikeInfoDto {
  constructor(isLike: boolean, id: number) {
    this.isLike = isLike;
    this.id = id;
  }
  id: number;

  isLike: boolean;
}
