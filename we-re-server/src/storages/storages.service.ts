import { Injectable, Logger } from '@nestjs/common';
import { CreateStorageDto } from './dto/create-storage.dto';
import { UpdateStorageDto } from './dto/update-storage.dto';
import { StorageRepository } from './storages.repository';
import { DISCLOSURESCOPE, DisclosureScope } from 'src/entities/storage.entity';
import { UserRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { LikesService } from 'src/likes/likes.service';

@Injectable()
export class StoragesService {
  constructor(
    private readonly storageRepository: StorageRepository,
    private readonly userService: UsersService,
    private readonly likeService: LikesService,
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
    //TODO:: user id 본인 건지 체크 필요.
    const { storage_ids: ids } =
      await this.likeService.findManyStorageIdsByUserId(userId);
    return await this.storageRepository.findManyPublicStorageListByIds(ids);
  }
  async findManyPublicStorageOwnedListByIds(ids: number[]) {
    return await this.storageRepository.findManyPublicStorageListByIds(ids);
  }

  /**
   * get user id and webtoon id list related with storage.
   * @param id storage id
   * @returns {{userId,webtoon_id[]}}webtoon id list and storage owner's id
   */
  async findWebtoonIdListById(id: number) {
    const webtoon_id_list = await this.storageRepository.findWebtoonIdListById(
      id,
    );
    if (webtoon_id_list.length === 0) {
      return null;
    }
    const webtoon_ids = [];
    const user_id = webtoon_id_list[0].userId;
    webtoon_id_list.forEach((r) => webtoon_ids.push(r.webtoons_id));
    const result = { userId: user_id, webtoon_ids };
    return result;
  }
}
