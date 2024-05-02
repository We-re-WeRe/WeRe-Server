import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ReadLikeInfoDto } from 'src/likes/dto/read-like.dto';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { ReadWebtoonDto } from 'src/webtoons/dto/read-webtoon.dto';

export class ReadReviewDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  starPoint: number;

  @ApiProperty({ type: () => ReadLikeInfoDto })
  @ValidateNested()
  @IsNotEmpty()
  like: ReadLikeInfoDto;

  public rawToDto(raw: any) {
    this.id = raw.review_id;
    this.contents = raw.review_contents;
    this.starPoint = raw.review_star_point;
    return this;
  }
}

export class ReadReviewAndWebtoonDto extends ReadReviewDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty({ type: () => ReadWebtoonDto })
  @ValidateNested()
  @IsNotEmpty()
  webtoon: ReadWebtoonDto;

  public rawToDto(raw: any) {
    super.rawToDto(raw);
    this.webtoon = new ReadWebtoonDto(raw);
    return this;
  }
}

export class ReadReviewAndUserDto extends ReadReviewDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty({ type: () => ReadUserDto })
  @ValidateNested()
  @IsNotEmpty()
  user: ReadUserDto;

  public rawToDto(raw: any) {
    super.rawToDto(raw);
    this.user = new ReadUserDto(raw);
    return this;
  }
}
