import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';
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

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  public rawToDto(raw: any): ReadStorageBriefDto {
    this.id = raw.storage_id;
    this.createdAt = raw.storage_created_at;
    this.imageURL = raw.storage_image_url;
    this.name = raw.storage_name;
    this.totalLikes = raw.totalLikes;
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
  @IsEnum(DISCLOSURESCOPE)
  @IsNotEmpty()
  disclosureScope: DisclosureScope;

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
    this.disclosureScope = raw.storage_disclosure_scope;
    this.user = new ReadUserBriefDto(raw);
    return this;
  }
}
