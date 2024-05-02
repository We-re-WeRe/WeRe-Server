import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Tag } from 'src/entities/tag.entity';

export class ReadTagDto {
  constructor(tag: Tag) {
    this.id = tag.id;
    this.contents = tag.contents;
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
