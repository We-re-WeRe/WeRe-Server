import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNegative,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { REASON, Reason } from 'src/entities/point.entity';

export class CreatePointDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(REASON)
  reason: Reason;

  @ApiProperty()
  @IsInt()
  @IsNegative()
  @IsOptional()
  mount?: number;

  public get Reason(): Reason {
    return this.reason;
  }
  public get Mount(): number {
    return this.mount;
  }
}
