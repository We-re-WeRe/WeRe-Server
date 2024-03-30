import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, ValidateNested, IsDate, IsNotEmpty } from 'class-validator';
import { Reason } from 'src/entities/point.entity';

@Exclude()
export class ReadPointHistoryDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  mount: number;

  @ApiProperty()
  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  reason: Reason;

  @ApiProperty()
  @Expose()
  @IsDate()
  @IsNotEmpty()
  created_at: Date;
}

@Exclude()
export class ReadPointSumDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalPoint: number;
}
