import { ApiProperty } from '@nestjs/swagger';
import { Tag } from 'src/entities/tag.entity';

export class ReadTagDto {
  constructor(tag: Tag) {
    this.id = tag.id;
    this.contents = tag.contents;
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  contents: string;
}
