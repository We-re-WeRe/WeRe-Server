import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class AddAndRemoveWebtoonLikeDto extends AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  webtoonId: number;
}

export class AddAndRemoveReviewLikeDto extends AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  reviewId: number;
}

export class AddAndRemoveStorageLikeDto extends AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  storageId: number;
}
