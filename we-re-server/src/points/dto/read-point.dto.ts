import { ApiProperty } from '@nestjs/swagger';
import { Reason } from 'src/entities/point.entity';

export class ReadPointHistoryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  mount: number;

  @ApiProperty()
  reason: Reason;

  @ApiProperty()
  createdAt: Date;
}

export class ReadPointSumDto {
  constructor(raw: any, userId: number) {
    this.userId = userId;
    this.totalPoint = raw?.totalPoint || 0;
  }
  @ApiProperty()
  userId: number;

  @ApiProperty()
  totalPoint: number;
}
