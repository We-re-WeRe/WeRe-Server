import { Injectable } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';

@Injectable()
export class StoragesService {
  constructor(private readonly storageRepository: StorageRepository) {}

  async findOneDetailById(id: number) {
    return await this.storageRepository.findOneDetailById(id);
  }
  async findManyPublicStorageList() {
    return await this.storageRepository.findManyPublicStorageList();
  }
  async findManyStorageListByUserIdAndDisclosureScope(userId: number) {
    //TODO:: disclosure scope 유저 login service에서 본인 판단 후 인자로 전달해줘야함.
    const isMe = false;
    const disclosureScope = isMe
      ? [DISCLOSURESCOPE.PUBLIC, DISCLOSURESCOPE.PRIVATE]
      : [DISCLOSURESCOPE.PUBLIC];
    return await this.storageRepository.findManyStorageListByUserIdAndDisclosureScope(
      userId,
      disclosureScope,
    );
  }
  async findManyPublicStorageListByIds(ids: number[]) {
    return await this.storageRepository.findManyPublicStorageListByIds(ids);
  }
}
