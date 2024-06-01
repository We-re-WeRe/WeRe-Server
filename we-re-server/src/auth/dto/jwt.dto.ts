import { ApiProperty } from '@nestjs/swagger';

export class ReadJWTDto {
  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  accessToken: string;

  refreshToken: string;
}

export class ReadAccessTokenDto {
  constructor(readJWTDto: ReadJWTDto) {
    this.accessToken = readJWTDto.accessToken;
  }
  @ApiProperty()
  accessToken: string;
}

export class Payload {
  constructor(userId: number) {
    this.userId = userId;
  }
  userId: number;
}
