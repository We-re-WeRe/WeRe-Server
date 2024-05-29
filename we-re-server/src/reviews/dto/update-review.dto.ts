import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  contents?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  starPoint?: number;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  tags?: string[];
}
