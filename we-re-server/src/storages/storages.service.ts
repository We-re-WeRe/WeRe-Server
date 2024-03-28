import { Injectable, Logger } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StoragesService {
  constructor(
    private readonly storageRepository: StorageRepository,
    private readonly userService: UsersService,
  ) {}

  /**
   * get Storage Detail for storage page.
   * @param id storage id
   * @returns storage detail and user brief info
   */
  async findOneDetailById(id: number) {
    const storage_details = await this.storageRepository.findOneDetailById(id);
    const { userId } = storage_details;
    const user_brief_info = await this.userService.findOneBriefById(userId);
    delete storage_details.userId;
    const result = { ...storage_details, ...user_brief_info };
    return result;
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
  async findManyPublicStorageLikedListByIds(userId: number) {
    //TODO:: like를 user ID로 조인해서 storage id를 다 가져온 값을 인자로 전달 필요.
    // user id 본인 건지 체크 필요.
    const ids: number[] = [1, 2];
    return await this.storageRepository.findManyPublicStorageListByIds(ids);
  }
  async findManyPublicStorageOwnedListByIds(ids: number[]) {
    return await this.storageRepository.findManyPublicStorageListByIds(ids);
  }
}
