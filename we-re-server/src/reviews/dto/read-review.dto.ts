import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { User } from 'src/entities/user.entity';
import { Webtoon } from 'src/entities/webtoon.entity';

@Exclude()
export class ReadReviewDto {
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
}

export class ReadReviewAndWebtoonDto extends ReadReviewDto {
  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  webtoon: Webtoon;
}

export class ReadReviewAndUserDto extends ReadReviewDto {
  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  user: User;
}
