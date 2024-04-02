import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { DisclosureScope } from 'src/entities/storage.entity';
import { ReadUserBriefDto } from 'src/users/dto/read-user.dto';

export class ReadStorageBriefDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalLikes: number;

  public rawToDto(raw: any): ReadStorageBriefDto {
    this.id = raw.storage_id;
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

  @Expose()
  @IsString()
  @IsNotEmpty()
  explain: string;

  @Expose()
  @ValidateNested()
  @IsNotEmpty()
  disclosureScope: DisclosureScope;

  @Expose()
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
