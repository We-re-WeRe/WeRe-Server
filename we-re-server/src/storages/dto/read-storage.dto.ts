import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ReadLikeInfoDto } from 'src/likes/dto/read-like.dto';
import { ReadTagDto } from 'src/tags/dto/read-tag.dto';
import { ReadUserBriefDto } from 'src/users/dto/read-user.dto';

export class ReadStorageBriefDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: () => ReadLikeInfoDto })
  @ValidateNested()
  @IsNotEmpty()
  like: ReadLikeInfoDto;

  public rawToDto(raw: any): ReadStorageBriefDto {
    this.id = raw.storage_id;
    this.createdAt = raw.storage_created_at;
    this.imageURL = raw.storage_image_url;
    this.name = raw.storage_name;
    return this;
  }
}

export class ReadStorageDetailDto extends ReadStorageBriefDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  explain: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isMine: boolean;

  @ApiProperty({ type: () => [ReadTagDto] })
  @ValidateNested()
  @IsNotEmpty()
  tags: ReadTagDto[];

  @ApiProperty({ type: () => ReadUserBriefDto })
  @ValidateNested()
  @IsNotEmpty()
  user: ReadUserBriefDto;

  public rawToDto(raw: any): ReadStorageDetailDto {
    super.rawToDto(raw);
    this.explain = raw.storage_explain;
    this.isPublic = raw.storage_is_public;
    this.user = new ReadUserBriefDto(raw);
    return this;
  }

  public setIsMine(userId: number): void {
    this.isMine = userId === this.user.getId();
  }
}
