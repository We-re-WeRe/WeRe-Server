import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';

@Injectable()
export class StoragesService {
  constructor(private readonly storageRepository: StorageRepository) {}

  findOneDetailById(id: number) {
    return this.storageRepository.findOneDetailById(id);
  }
}
