import { PartialType } from '@nestjs/swagger';
import { CreateLocalAuthDto } from './create-auth.dto';

export class UpdateLogInDto extends PartialType(CreateLocalAuthDto) {}
