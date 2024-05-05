import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  starPoint: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  webtoonId: string;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
