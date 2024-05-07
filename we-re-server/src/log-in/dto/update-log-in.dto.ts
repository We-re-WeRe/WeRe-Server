import { PartialType } from '@nestjs/swagger';
import { CreateLogInDto } from './create-log-in.dto';

export class UpdateLogInDto extends PartialType(CreateLogInDto) {}
