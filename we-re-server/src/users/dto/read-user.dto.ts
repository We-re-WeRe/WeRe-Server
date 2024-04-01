import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@Exclude()
export class ReadUserDetailDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  userImageURL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Expose()
  @IsString()
  introduceMe?: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalFollowers: number;

  public entityToDto(entity: any): ReadUserDetailDto {
    this.userImageURL = entity.user_imageURL;
    this.nickname = entity.user_nickname;
    this.introduceMe = entity.user_introduceMe;
    this.totalFollowers = entity.totalFollowers;
    return this;
  }
}

@Exclude()
export class ReadUserBreifDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  userImageURL: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Expose()
  @IsInt()
  @IsNotEmpty()
  totalFollowers: number;

  public entityToDto(entity: any): ReadUserBreifDto {
    this.userImageURL = entity.user_imageURL;
    this.nickname = entity.user_nickname;
    this.totalFollowers = entity.totalFollowers;
    return this;
  }
}

@Exclude()
export class ReadUserProfileImageDto {
  @Expose()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  imageURL: string;
}
