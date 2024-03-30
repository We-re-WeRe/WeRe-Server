import { IsInt, ValidateNested, IsDate } from 'class-validator';
import { Reason } from 'src/entities/point.entity';

export class ReadPointHistoryDto {
  @IsInt()
  mount: number;

  @ValidateNested()
  reason: Reason;

  @IsDate()
  createdDate: Date;
}

export class ReadPointSumDto {
  @IsInt()
  totalPoint: number;
}
