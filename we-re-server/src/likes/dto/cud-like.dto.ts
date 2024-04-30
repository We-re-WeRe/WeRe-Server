import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  public getType() {
    return '';
  }
  public getTargetId(): number {
    return;
  }
}

export class AddAndRemoveWebtoonLikeDto extends AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  webtoonId: number;

  public getType() {
    return 'webtoon';
  }
  public getTargetId(): number {
    return this.webtoonId;
  }
}

export class AddAndRemoveReviewLikeDto extends AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  reviewId: number;

  public getType() {
    return 'review';
  }
  public getTargetId(): number {
    return this.reviewId;
  }
}

export class AddAndRemoveStorageLikeDto extends AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  storageId: number;

  public getType() {
    return 'storage';
  }
  public getTargetId(): number {
    return this.storageId;
  }
}
