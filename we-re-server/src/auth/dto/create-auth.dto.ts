import { ApiProperty } from '@nestjs/swagger';
import { LocalAuthDto } from './auth.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class CreateLocalAuthDto extends LocalAuthDto {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  user: CreateUserDto;
}
