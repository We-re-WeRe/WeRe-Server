import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';
import { AddAndRemoveTagRequestDto } from 'src/tags/dto/process-tag.dto';

export class CreateStorageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explain: string;

  @ApiProperty()
  @IsEnum(DISCLOSURESCOPE)
  @Transform(({ value }) => DISCLOSURESCOPE[value.toUpperCase()])
  @IsNotEmpty()
  disclosureScope: DisclosureScope;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
