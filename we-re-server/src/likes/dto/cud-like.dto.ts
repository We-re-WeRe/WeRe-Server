import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

const types = ['review', 'webtoon', 'storage'];
export class LikeRequestDto {
  constructor(likeType: string, targetId: number) {
    this.likeType = likeType;
    this.targetId = targetId;
  }
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(types)
  likeType: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetId: number;
}

export class AddAndRemoveLikeDto extends LikeRequestDto {
  constructor(userId: number, likeType: string, targetId: number) {
    super(likeType, targetId);
    this.userId = userId;
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
