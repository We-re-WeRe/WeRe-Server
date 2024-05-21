import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ReadUserDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  imageURL: string;

  @ApiProperty()
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

export class ReadUserDetailDto extends ReadUserDto {
  constructor(userId: number, raw: any) {
    super();
    this.rawToDto(raw);
    this.isMine = userId === this.getId();
  }
  @ApiProperty()
  @IsString()
  introduceMe?: string;

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalFollowers: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isMine: boolean;

  public rawToDto(raw: any): ReadUserDetailDto {
    super.rawToDto(raw);
    this.introduceMe = raw.user_introduce_me;
    this.totalFollowers = raw.totalFollowers;
    return this;
  }
}

export class ReadUserBriefDto extends ReadUserDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  totalFollowers: number;

  public rawToDto(raw: any): ReadUserBriefDto {
    super.rawToDto(raw);
    this.totalFollowers = raw.totalFollowers;
    return this;
  }
}
