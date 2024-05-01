import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

const types = ['review', 'webtoon', 'storage'];
export class LikeRequestDto {
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
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
