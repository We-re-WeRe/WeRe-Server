import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  DAYS,
  Days,
  PROVIDINGCOMPANY,
  ProvidingCompany,
} from 'src/entities/webtoon.entity';
import {
  ReadReviewAndUserDto,
  ReadReviewDto,
} from 'src/reviews/dto/read-review.dto';
import { ReadStorageBriefDto } from 'src/storages/dto/read-storage.dto';

export class ReadWebtoonDto {
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
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  painter: string;

  public rawToDto(raw: any): ReadWebtoonDto {
    this.id = raw.webtoon_id;
    this.title = raw.webtoon_title;
    this.imageURL = raw.webtoon_image_url;
    this.author = raw.webtoon_author;
    this.painter = raw.webtoon_painter;
    return this;
  }
}

export class ReadWebtoonThumbnailDto extends ReadWebtoonDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalStarPoint: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  reviewCount: number;

  public rawToDto(raw: any): ReadWebtoonThumbnailDto {
    super.rawToDto(raw);
    this.totalStarPoint = raw.totalStarPoint;
    this.reviewCount = raw.reviewCount;
    return this;
  }
}

export class ReadWebtoonBriefDto extends ReadWebtoonDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  @ApiProperty({ type: () => ReadReviewDto })
  @ValidateNested()
  @IsNotEmpty()
  review: ReadReviewDto;

  public rawToDto(raw: any): ReadWebtoonBriefDto {
    super.rawToDto(raw);
    this.totalLikes = raw.totalWebtoonLikes;
    this.review = new ReadReviewDto(raw);
    return this;
  }
}

export class ReadWebtoonDetailDto extends ReadWebtoonDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  webtoonURL: string;

  @ApiProperty()
  @IsEnum(PROVIDINGCOMPANY)
  @IsNotEmpty()
  providingCompany: ProvidingCompany;

  @ApiProperty()
  @IsEnum(DAYS)
  day?: Days;

  @ApiProperty()
  @IsString()
  genre?: string;

  @ApiProperty()
  @IsString()
  explain?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  viewCount: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalStarPoint: number;

  @ApiProperty({ type: () => [ReadStorageBriefDto] })
  @ValidateNested()
  @IsNotEmpty()
  storages: ReadStorageBriefDto[];

  @ApiProperty({ type: () => [ReadReviewAndUserDto] })
  @IsArray()
  @IsNotEmpty()
  reviews: ReadReviewAndUserDto[];

  public rawToDto(raw: any): ReadWebtoonDetailDto {
    super.rawToDto(raw);
    this.webtoonURL = raw.webtoon_webtoon_url;
    this.providingCompany = raw.webtoon_providing_company;
    this.day = raw.webtoon_day;
    this.genre = raw.webtoon_genre;
    this.explain = raw.webtoon_explain;
    this.viewCount = raw.webtoon_view_count;
    this.totalLikes = raw.totalLikes;
    this.totalStarPoint = raw.totalStarPoint;
    return this;
  }
}
