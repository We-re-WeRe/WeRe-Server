import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  contents?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  starPoint?: number;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @IsOptional()
  contentsArray?: string[];
}
