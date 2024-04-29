import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import {
  DAYS,
  Days,
  PROVIDINGCOMPANY,
  ProvidingCompany,
} from 'src/entities/webtoon.entity';

export class CreateWebtoonDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  webtoonURL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  painter: string;

  @ApiProperty()
  @IsEnum(PROVIDINGCOMPANY)
  @Transform(({ value }) => PROVIDINGCOMPANY[value.toUpperCase()])
  @IsNotEmpty()
  providingCompany: ProvidingCompany;

  @ApiProperty()
  @IsEnum(DAYS)
  @Transform(({ value }) => DAYS[value.toUpperCase()])
  @IsNotEmpty()
  day?: Days;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  genre?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explain?: string;
}
