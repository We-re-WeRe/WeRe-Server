import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { SEX, Sex } from 'src/entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  nickname: string;

  @ApiProperty()
  @IsString()
  @MaxLength(10)
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
}
