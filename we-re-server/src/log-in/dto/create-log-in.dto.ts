import { ApiProperty } from '@nestjs/swagger';
import { LocalLoginInfoDto } from './log-in.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateLocalLoginInfoDto extends LocalLoginInfoDto {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  user: CreateUserDto;
}
