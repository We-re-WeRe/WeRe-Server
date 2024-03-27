import { PartialType } from '@nestjs/mapped-types';
import { CreateWebtoonDto } from './create-webtoon.dto';

export class UpdateWebtoonDto extends PartialType(CreateWebtoonDto) {}
