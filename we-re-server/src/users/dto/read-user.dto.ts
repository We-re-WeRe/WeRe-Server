import { ApiProperty } from '@nestjs/swagger';

export class ReadUserDto {
  constructor(raw?: any) {
    raw && this.rawToDto(raw);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageURL: string;

  @ApiProperty()
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
  introduceMe?: string;

  @ApiProperty()
  totalFollowers: number;

  @ApiProperty()
  isMine: boolean;

  @ApiProperty()
  isFollowing: boolean;

  public rawToDto(raw: any): ReadUserDetailDto {
    super.rawToDto(raw);
    this.introduceMe = raw.user_introduce_me;
    this.totalFollowers = raw.totalFollowers;
    return this;
  }

  public setIsFollowing(isFollowing: boolean) {
    this.isFollowing = isFollowing;
  }
}

export class ReadUserBriefDto extends ReadUserDto {
  constructor(raw: any) {
    super();
    this.rawToDto(raw);
  }
  @ApiProperty()
  totalFollowers: number;

  public rawToDto(raw: any): ReadUserBriefDto {
    super.rawToDto(raw);
    this.totalFollowers = raw.totalFollowers;
    return this;
  }
}
