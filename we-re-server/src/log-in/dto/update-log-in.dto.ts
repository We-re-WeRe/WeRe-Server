import { PartialType } from '@nestjs/swagger';
import { CreateLoginInfoDto } from './create-log-in.dto';

export class UpdateLogInDto extends PartialType(CreateLoginInfoDto) {}
