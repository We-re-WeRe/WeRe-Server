import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class WebtoonInStorageDto {
  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  webtoonId: number;
}
