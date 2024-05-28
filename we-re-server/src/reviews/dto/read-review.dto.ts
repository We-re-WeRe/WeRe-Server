import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReadLikeInfoDto } from 'src/likes/dto/read-like.dto';
import { ReadTagDto } from 'src/tags/dto/read-tag.dto';
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
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  starPoint: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isMine: boolean;

  @ApiProperty({ type: () => ReadLikeInfoDto })
  @ValidateNested()
  @IsNotEmpty()
  like: ReadLikeInfoDto;

  @ApiProperty({ type: () => [ReadTagDto] })
  @ValidateNested()
  @IsNotEmpty()
  tags: ReadTagDto[];

  public rawToDto(raw: any) {
    this.id = raw.review_id;
    this.createdAt = raw.review_created_at;
    this.contents = raw.review_contents;
    this.starPoint = raw.review_star_point;
    return this;
  }

  public setIsMine(userId: number, ownerId: number) {
    this.isMine = userId === ownerId;
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
