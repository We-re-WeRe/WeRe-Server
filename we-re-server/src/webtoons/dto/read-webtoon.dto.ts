import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Days, ProvidingCompany } from 'src/entities/webtoon.entity';
import {
  ReadReviewAndUserDto,
  ReadReviewDto,
} from 'src/reviews/dto/read-review.dto';
import { ReadStorageBriefDto } from 'src/storages/dto/read-storage.dto';

export class ReadWebtoonDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  author: string;

  @Expose()
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
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalStarPoint: number;

  @Expose()
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
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  @Expose()
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
  @Expose()
  @IsString()
  @IsNotEmpty()
  webtoonURL: string;

  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  providingCompany: ProvidingCompany;

  @Expose()
  @ValidateNested()
  day?: Days;

  @Expose()
  @IsString()
  genre?: string;

  @Expose()
  @IsString()
  explain?: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  viewCount: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalStarPoint: number;

  @Expose()
  @ValidateNested()
  storages: ReadStorageBriefDto[];

  @Expose()
  @ValidateNested()
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
