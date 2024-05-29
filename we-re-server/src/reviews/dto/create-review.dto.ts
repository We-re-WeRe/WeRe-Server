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

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  contents: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(10)
  @IsNotEmpty()
  starPoint: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  webtoonId: number;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @ArrayMaxSize(5)
  @IsOptional()
  tags?: string[];

  public getStringWebtoonId(): string {
    return `${this.webtoonId}`;
  }
}
