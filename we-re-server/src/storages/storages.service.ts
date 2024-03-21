import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';

@Injectable()
export class StoragesService {
  constructor(private readonly storageRepository: StorageRepository) {}

  async findOneDetailById(id: number) {
    return await this.storageRepository.findOneDetailById(id);
  }
  async findManyPublicStorageList() {
    return await this.storageRepository.findManyPublicStorageList();
  }
  async findManyPublicStorageListByIds(ids: number[]) {
    return await this.storageRepository.findManyPublicStorageListByIds(ids);
  }
}
