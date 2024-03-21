import { Injectable } from '@nestjs/common';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';

@Injectable()
export class WebtoonsService {
  create(createWebtoonDto: CreateWebtoonDto) {
    return 'This action adds a new webtoon';
  }

  findAll() {
    return `This action returns all webtoons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} webtoon`;
  }

  update(id: number, updateWebtoonDto: UpdateWebtoonDto) {
    return `This action updates a #${id} webtoon`;
  }

  remove(id: number) {
    return `This action removes a #${id} webtoon`;
  }
}
