import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTagDto {
  constructor(id: number, contents: string) {
    this.id = id;
    this.contents = contents;
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contents: string;
}
