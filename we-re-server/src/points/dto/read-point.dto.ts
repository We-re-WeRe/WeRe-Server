import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate, IsNotEmpty, IsEnum } from 'class-validator';
import { REASON, Reason } from 'src/entities/point.entity';

export class ReadPointHistoryDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  mount: number;

  @ApiProperty()
  @IsEnum(REASON)
  @IsNotEmpty()
  reason: Reason;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}

export class ReadPointSumDto {
  constructor(raw: any, userId: number) {
    this.userId = userId;
    this.totalPoint = raw?.totalPoint || 0;
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalPoint: number;
}
