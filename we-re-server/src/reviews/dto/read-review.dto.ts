import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Webtoon } from 'src/entities/webtoon.entity';
import { ReadUserDto } from 'src/users/dto/read-user.dto';
import { ReadWebtoonDto } from 'src/webtoons/dto/read-webtoon.dto';

@Exclude()
export class ReadReviewDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  starPoint: number;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  public rawToDto(raw: any) {
    this.id = raw.review_id;
    this.contents = raw.review_contents;
    this.starPoint = raw.review_star_point;
    this.totalLikes = raw.totalLikes;
    return this;
  }
}

@Exclude()
export class ReadReviewAndWebtoonDto extends ReadReviewDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  webtoon: ReadWebtoonDto;

  public rawToDto(raw: any) {
    super.rawToDto(raw);
    this.webtoon = new ReadWebtoonDto(raw);
    return this;
  }
}

@Exclude()
export class ReadReviewAndUserDto extends ReadReviewDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  user: ReadUserDto;

  public rawToDto(raw: any) {
    super.rawToDto(raw);
    this.user = new ReadUserDto(raw);
    return this;
  }
}
