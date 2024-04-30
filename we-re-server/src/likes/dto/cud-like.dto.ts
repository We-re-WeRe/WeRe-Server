import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

const types = ['review', 'webtoon', 'storage'];
export class AddAndRemoveLikeDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

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
