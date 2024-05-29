import { ApiProperty } from '@nestjs/swagger';

export class ReadJWTDto {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class Payload {
  constructor(userId: number) {
    this.userId = userId;
  }
  userId: number;
}
