import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ReadUserDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @ApiProperty()
  @Expose()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  public rawToDto(raw: any): ReadUserDto {
    this.id = raw.user_id;
    this.imageURL = raw.user_image_url;
    this.nickname = raw.user_nickname;
    return this;
  }
  public getId(): number {
    return this.id;
  }
  public setId(id: number): void {
    this.id = id;
  }
}

@Exclude()
export class ReadUserDetailDto extends ReadUserDto {
  @ApiProperty()
  @Expose()
  @IsString()
  introduceMe?: string;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalFollowers: number;

  public rawToDto(raw: any): ReadUserDetailDto {
    super.rawToDto(raw);
    this.introduceMe = raw.user_introduce_me;
    this.totalFollowers = raw.totalFollowers;
    return this;
  }
}

@Exclude()
export class ReadUserBriefDto extends ReadUserDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalFollowers: number;

  public rawToDto(raw: any): ReadUserBriefDto {
    super.rawToDto(raw);
    this.totalFollowers = raw.totalFollowers;
    return this;
  }
}
