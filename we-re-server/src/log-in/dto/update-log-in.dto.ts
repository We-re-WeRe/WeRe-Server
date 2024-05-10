import { PartialType } from '@nestjs/swagger';
import { CreateLocalLoginInfoDto } from './create-log-in.dto';

export class UpdateLogInDto extends PartialType(CreateLocalLoginInfoDto) {}
