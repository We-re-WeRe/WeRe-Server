import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StoragesService } from './storages.service';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';

@Controller('storages')
export class StoragesController {
  constructor(private readonly storagesService: StoragesService) {}

  @Get('detail/:id')
  async findOneDetailById(@Param('id') id: string) {
    return await this.storagesService.findOneDetailById(+id);
  }

  @Get('list')
  async findManyPublicStorageList() {
    return await this.storagesService.findManyPublicStorageList();
  }
}
