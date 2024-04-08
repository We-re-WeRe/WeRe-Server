import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageURL?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  introduceMe?: string;
}
