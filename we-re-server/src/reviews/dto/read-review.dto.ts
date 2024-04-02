import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Webtoon } from 'src/entities/webtoon.entity';
import { ReadUserDto } from 'src/users/dto/read-user.dto';

@Exclude()
export class ReadReviewDto {
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
  contents: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  starPoint: number;

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

export class ReadReviewAndWebtoonDto extends ReadReviewDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  webtoon: Webtoon;

  public rawToDto(raw: any) {
    super.rawToDto(raw);
    // this.webtoon = new ReadUserDto(raw);
    return this;
  }
}

export class ReadReviewAndUserDto extends ReadReviewDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
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
