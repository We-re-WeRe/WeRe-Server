import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { REASON, Reason } from 'src/entities/point.entity';

@Exclude()
export class CreatePointDto {
  @ApiProperty()
  @Expose()
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsEnum(REASON)
  reason: Reason;

  @ApiProperty()
  @Expose()
  @IsInt()
  @IsOptional()
  mount?: number;

  public get UserIdString(): string {
    return `${this.userId}`;
  }
  public get Reason(): Reason {
    return this.reason;
  }
  public get Mount(): number {
    return this.mount;
  }
}
