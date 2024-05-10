import { Logger } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { SEX, Sex } from 'src/entities/user.entity';
import { CreateLoginInfoDto } from 'src/log-in/dto/create-log-in.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(SEX)
  @Transform(({ value }) => {
    value = value.toUpperCase();
    return !!SEX[value] ? SEX[value] : value;
  })
  @IsNotEmpty()
  sex: Sex;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  birth: Date;

  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  loginInfo: CreateLoginInfoDto;
}
