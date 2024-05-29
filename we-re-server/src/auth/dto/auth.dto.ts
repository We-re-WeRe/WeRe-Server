import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LocalAuthDto {
  @ApiProperty()
  @IsString()
  @MinLength(8, {
    message: 'account is too short',
  })
  @MaxLength(20, {
    message: 'account is too long',
  })
  @IsNotEmpty()
  account: string;

  @ApiProperty()
  @IsString()
  @MaxLength(16, {
    message: 'password is too long',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsNotEmpty()
  password: string;
}
