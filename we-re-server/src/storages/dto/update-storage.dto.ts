import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';

export class UpdateStorageDto {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageURL?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  explain?: string;

  @ApiProperty()
  @IsEnum(DISCLOSURESCOPE)
  @Transform(({ value }) => DISCLOSURESCOPE[value.toUpperCase()])
  @IsOptional()
  disclosureScope?: DisclosureScope;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
