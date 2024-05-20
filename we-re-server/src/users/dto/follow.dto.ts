import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
export class FollowDto {
  constructor(id: number, targetId: number) {
    this.id = id;
    this.targetId = targetId;
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  targetId: number;
}
