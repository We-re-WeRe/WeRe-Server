import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WebtoonsService } from './webtoons.service';
import { CreateWebtoonDto } from './dto/create-webtoon.dto';
import { UpdateWebtoonDto } from './dto/update-webtoon.dto';

@Controller('webtoons')
export class WebtoonsController {
  constructor(private readonly webtoonsService: WebtoonsService) {}

  @Post()
  create(@Body() createWebtoonDto: CreateWebtoonDto) {
    return this.webtoonsService.create(createWebtoonDto);
  }

  @Get()
  findAll() {
    return this.webtoonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webtoonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWebtoonDto: UpdateWebtoonDto) {
    return this.webtoonsService.update(+id, updateWebtoonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webtoonsService.remove(+id);
  }
}
