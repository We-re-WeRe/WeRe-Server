import { ApiProperty } from '@nestjs/swagger';
import { Days, ProvidingCompany } from 'src/entities/webtoon.entity';
import { ReadLikeInfoDto } from 'src/likes/dto/read-like.dto';
import { ReadReviewDto } from 'src/reviews/dto/read-review.dto';

export class ReadWebtoonDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  imageURL: string;

  @ApiProperty({ type: () => [String] })
  author: string[];

  @ApiProperty({ type: () => [String] })
  painter: string[];

  public rawToDto(raw: any): ReadWebtoonDto {
    this.id = raw.webtoon_id;
    this.title = raw.webtoon_title;
    this.imageURL = raw.webtoon_image_url;
    const authors: string[] = raw.webtoon_author
      .split(',')
      .map((a: string) => a.trim());
    const painters: string[] = raw.webtoon_painter
      .split(',')
      .map((p: string) => p.trim());
    this.author = authors;
    this.painter = painters;
    return this;
  }
}

export class ReadWebtoonThumbnailDto extends ReadWebtoonDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  totalStarPoint: number;

  @ApiProperty()
  reviewCount: number;

  public rawToDto(raw: any): ReadWebtoonThumbnailDto {
    super.rawToDto(raw);
    this.totalStarPoint = raw.totalStarPoint | 0;
    this.reviewCount = raw.reviewCount;
    return this;
  }
}

export class ReadWebtoonBriefDto extends ReadWebtoonDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty({ type: () => ReadLikeInfoDto })
  like: ReadLikeInfoDto;

  @ApiProperty({ type: () => ReadReviewDto })
  review: ReadReviewDto;

  public rawToDto(raw: any): ReadWebtoonBriefDto {
    super.rawToDto(raw);
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
  webtoonURL: string;

  @ApiProperty()
  providingCompany: ProvidingCompany;

  @ApiProperty()
  day?: Days;

  @ApiProperty()
  genre?: string;

  @ApiProperty()
  explain?: string;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  reviewCount: number;

  @ApiProperty()
  totalStarPoint: number;

  @ApiProperty({ type: () => ReadLikeInfoDto })
  like: ReadLikeInfoDto;

  public rawToDto(raw: any): ReadWebtoonDetailDto {
    super.rawToDto(raw);
    this.webtoonURL = raw.webtoon_webtoon_url;
    this.providingCompany = raw.webtoon_providing_company;
    this.day = raw.webtoon_day;
    this.genre = raw.webtoon_genre;
    this.explain = raw.webtoon_explain;
    this.viewCount = raw.webtoon_view_count;
    this.reviewCount = raw.reviewCount;
    this.totalStarPoint = raw.totalStarPoint;
    return this;
  }
}
