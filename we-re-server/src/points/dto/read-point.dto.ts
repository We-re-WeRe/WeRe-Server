import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDate, IsNotEmpty, IsEnum } from 'class-validator';
import { REASON, Reason } from 'src/entities/point.entity';

export class ReadPointHistoryDto {
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
  created_at: Date;
}

export class ReadPointSumDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalPoint: number;
}
