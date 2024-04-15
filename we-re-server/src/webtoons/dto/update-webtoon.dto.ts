import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  DAYS,
  Days,
  PROVIDINGCOMPANY,
  ProvidingCompany,
} from 'src/entities/webtoon.entity';

export class UpdateWebtoonDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageURL?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  webtoonURL?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  painter?: string;

  @ApiProperty()
  @IsEnum(PROVIDINGCOMPANY)
  @Transform(({ value }) => PROVIDINGCOMPANY[value.toUpperCase()])
  @IsOptional()
  providingCompany?: ProvidingCompany;

  @ApiProperty()
  @IsEnum(DAYS)
  @Transform(({ value }) => DAYS[value.toUpperCase()])
  @IsOptional()
  day?: Days;

  @ApiProperty()
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  explain?: string;
}
