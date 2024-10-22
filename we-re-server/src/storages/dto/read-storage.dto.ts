import { ApiProperty } from '@nestjs/swagger';
import { Storage } from 'src/entities/storage.entity';
import { ReadLikeInfoDto } from 'src/likes/dto/read-like.dto';
import { ReadTagDto } from 'src/tags/dto/read-tag.dto';
import { ReadUserBriefDto } from 'src/users/dto/read-user.dto';

export class ReadStorageBriefDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  imageURL: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => ReadLikeInfoDto })
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
  explain: string;

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  isMine: boolean;

  @ApiProperty({ type: () => [ReadTagDto] })
  tags: ReadTagDto[];

  @ApiProperty({ type: () => ReadUserBriefDto })
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

export class ReadMyStorageBriefDto {
  constructor(storage: Storage, webtoonId: number) {
    this.rawToDto(storage, webtoonId);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageURL: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  webtoonCount: number;

  @ApiProperty()
  isWebtoonIn: boolean;

  public rawToDto(storage: Storage, webtoonId: number): ReadMyStorageBriefDto {
    this.id = storage.id;
    this.imageURL = storage.imageURL;
    this.name = storage.name;
    this.webtoonCount = storage.webtoons.length;
    this.isWebtoonIn = !!storage.webtoons.find((w) => w.id === webtoonId);
    return this;
  }
}
