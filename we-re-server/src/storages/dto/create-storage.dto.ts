import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStorageDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUrl()
  @IsOptional()
  imageURL?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(300)
  @IsNotEmpty()
  explain: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @ApiProperty({ type: () => [String] })
  @IsArray()
  @ArrayMaxSize(5)
  @MaxLength(10, {
    each: true,
  })
  @IsOptional()
  tags?: string[];
}
