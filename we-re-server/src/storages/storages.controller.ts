import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoragesService } from './storages.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Controller('storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Post()
  create(@Body() createStorageDto: CreateStorageDto) {
    return this.storagesService.create(createStorageDto);
  }

  @Get()
  findAll() {
    return this.storagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStorageDto: UpdateStorageDto) {
    return this.storagesService.update(+id, updateStorageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storagesService.remove(+id);
  }
}
