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
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  webtoonId: number;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  public getStringUserId(): string {
    return `${this.userId}`;
  }

  public getStringWebtoonId(): string {
    return `${this.webtoonId}`;
  }
}
